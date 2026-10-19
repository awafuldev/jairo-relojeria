export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

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
                href={`mailto:bespoke@chrono.com?subject=Pedido de Reloj Bespoke ${codeDisplay}&body=Hola Jairo Relojería,%0D%0A%0D%0ADeseo encargar la manufactura de este diseño con código oficial: ${codeDisplay}`}
                className="btn-teal flex-1 justify-center py-3.5 text-[11px] uppercase tracking-wider font-semibold"
              >
                Solicitar Este Reloj al Taller →
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
