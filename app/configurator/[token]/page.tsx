export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getWhatsAppUrl } from '@/lib/whatsapp'

export default async function ViewSavedConfigurationPage({
  params
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  // Look up by shareCode (e.g. JR-8F42K or WM-8F42K) or shareToken (UUID)
  const config = await prisma.configuration.findFirst({
    where: {
      OR: [
        { shareCode: token },
        { shareToken: token },
      ],
    },
    include: {
      items: {
        include: {
          piece: {
            include: {
              images: true,
            }
          },
          category: true,
        },
      },
    },
  })

  if (!config) {
    notFound()
  }

  // Sort items by category step (1..12)
  const sortedItems = [...config.items].sort((a, b) => a.category.step - b.category.step)

  // Layers sorted by zIndex for visualizer
  const visualLayers = sortedItems
    .filter(item => {
      const img = item.piece.compositionImage || item.piece.layerImage || item.piece.productImage
      return img && item.piece.layerVisible
    })
    .map(item => ({
      ...item,
      resolvedImage: item.piece.compositionImage || item.piece.layerImage || item.piece.productImage!,
      resolvedZIndex: item.piece.layerZIndex !== undefined ? item.piece.layerZIndex : item.category.layerZIndex
    }))
    .sort((a, b) => a.resolvedZIndex - b.resolvedZIndex)

  const codeDisplay = config.shareCode || config.shareToken.slice(0, 8).toUpperCase()

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col font-poppins">
      <Navbar />

      <main className="container-blok pt-14 pb-20 max-w-5xl flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Watch Visualizer (5 cols) */}
          <div className="lg:col-span-5 bg-[#f7f7f7] border border-[#d5d6d7] rounded-[3px] aspect-square relative flex items-center justify-center p-6 sticky top-24">
            <div className="relative w-full h-full max-w-[340px] aspect-square flex items-center justify-center">
              {visualLayers.map(item => (
                <div
                  key={item.id}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{ zIndex: item.resolvedZIndex }}
                >
                  <img
                    src={item.resolvedImage.replace(/\.svg$/, '.png')}
                    alt={item.piece.name}
                    className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                    style={{
                      transform: `scale(${item.piece.layerScale}) translate(${item.piece.layerX}px, ${item.piece.layerY}px) rotate(${item.piece.layerRotation}deg)`,
                      opacity: item.piece.layerOpacity,
                    }}
                  />
                </div>
              ))}

              {config.engravingText && (
                <div className="absolute inset-x-0 bottom-12 text-center z-30 pointer-events-none">
                  <span className="font-mono text-[9px] tracking-widest uppercase bg-[#0a0d0f]/80 text-[#1dd8e1] px-2 py-0.5 rounded-[1px]">
                    {config.engravingText}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Details (7 cols) */}
          <div className="lg:col-span-7">
            <div className="mb-6">
              <span className="font-cabin text-[11px] uppercase tracking-[0.14em] text-[#1dd8e1] font-semibold block">
                CÓDIGO OFICIAL: {codeDisplay}
              </span>
              <h1 className="editorial-title text-2xl sm:text-3xl text-[#0a0d0f] tracking-[0.08em] mt-1">
                {config.name || 'Reloj Bespoke Personalizado'}
              </h1>
              <p className="text-[12px] text-[#2e3438] mt-1">
                Registrado en taller el {new Date(config.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Pieces list */}
            <div className="border border-[#d5d6d7] rounded-[3px] divide-y divide-[#d5d6d7] mb-8 bg-[#ffffff] overflow-hidden">
              <div className="p-3.5 bg-[#f7f7f7] flex items-center justify-between text-[12px]">
                <span className="font-cabin text-[11px] uppercase tracking-wider font-semibold text-[#0a0d0f]">
                  Ensamble Maestro & Calibración Suiza
                </span>
                <span className="font-mono text-[#0a0d0f] font-semibold">$250</span>
              </div>

              {sortedItems.map(item => {
                const img = item.piece.productImage || item.piece.compositionImage || item.piece.images[0]?.url || '/images/products/case-sub-40-steel.png'
                return (
                  <div key={item.id} className="p-3.5 flex items-center justify-between gap-4 text-[13px]">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-[#f7f7f7] border border-[#d5d6d7] rounded-[2px] overflow-hidden shrink-0 flex items-center justify-center p-1">
                        <img src={img.replace(/\.svg$/, '.png')} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-cabin text-[9px] uppercase tracking-wider text-[#2e3438] block">{item.category.name}</span>
                        <p className="font-poppins font-medium text-[13px] truncate text-[#0a0d0f]">{item.piece.name}</p>
                        <p className="font-mono text-[9px] text-[#2e3438]">{item.piece.sku}</p>
                      </div>
                    </div>
                    <span className="font-mono text-[13px] font-semibold shrink-0 text-[#0a0d0f]">
                      {item.priceAtTime > 0 ? `+$${item.priceAtTime.toFixed(0)}` : '$0'}
                    </span>
                  </div>
                )
              })}

              {config.engravingText && (
                <div className="p-3.5 flex items-center justify-between text-[13px] bg-[#f7f7f7]">
                  <div>
                    <span className="font-cabin text-[9px] uppercase tracking-wider text-[#2e3438] block">Grabado Láser</span>
                    <p className="font-mono text-[#0a0d0f] text-[12px]">"{config.engravingText}"</p>
                  </div>
                  <span className="font-mono text-[#0a0d0f] font-semibold">+$30</span>
                </div>
              )}

              <div className="p-4 bg-[#0a0d0f] text-white flex items-center justify-between">
                <div>
                  <span className="font-cabin text-[10px] uppercase tracking-[0.14em] text-white/70 block font-semibold">
                    Inversión Total
                  </span>
                  <span className="text-[10px] text-white/50">Listo para confirmación de encargo</span>
                </div>
                <span className="text-xl font-bold font-mono tabular-nums text-white">
                  ${config.totalPrice.toFixed(0)} <span className="font-cabin text-xs text-[#1dd8e1]">USD</span>
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={getWhatsAppUrl(
                  `¡Hola Jairo Relojería! Me gustaría encargar la manufactura de este diseño bespoke.\n\nCódigo de diseño: ${codeDisplay}\nInversión total: $${config.totalPrice.toFixed(0)} USD\n${config.engravingText ? `Grabado láser: "${config.engravingText}"\n` : ''}Enlace: https://jairo-relojeria.vercel.app/configurator/${token}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white flex-1 py-3.5 px-4 rounded-[3px] text-[11px] uppercase tracking-wider font-semibold transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                Pedir por WhatsApp →
              </a>
              <Link
                href="/configurator"
                className="btn-outline-dark flex-1 justify-center py-3.5 text-[11px] uppercase tracking-wider font-semibold text-center"
              >
                Configurar Otro Modelo
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
