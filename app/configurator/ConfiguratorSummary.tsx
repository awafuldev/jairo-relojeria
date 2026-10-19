'use client'

import { useState, useEffect } from 'react'
import { useConfiguratorStore } from '@/lib/store'
import { useI18n } from '@/lib/i18n/context'
import { getWhatsAppUrl } from '@/lib/whatsapp'
import Link from 'next/link'

export default function ConfiguratorSummary() {
  const {
    categories,
    selections,
    visualLayers,
    totalPrice,
    priceBreakdown,
    engravingText,
    engravingFont,
    setCurrentStep,
    reset,
  } = useConfiguratorStore()

  const { t } = useI18n()

  const [saving, setSaving] = useState(false)
  const [savedCode, setSavedCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [contactEmail, setContactEmail] = useState('bespoke@chrono.com')

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.contactEmail) {
          setContactEmail(data.contactEmail)
        }
      })
      .catch(() => {})
  }, [])

  // Generate or retrieve bespoke code: e.g. JR-8F42K
  const generateCode = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
    let rand = ''
    for (let i = 0; i < 5; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return `JR-${rand}`
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const code = generateCode()
      const items = Object.entries(selections).map(([catId, piece]) => ({
        pieceId: piece.id,
        categoryId: catId,
        priceAtTime: piece.price,
      }))

      const res = await fetch('/api/configurations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Reloj Bespoke ${code}`,
          shareCode: code,
          engravingText: engravingText || null,
          engravingFont: engravingFont || null,
          items,
        }),
      })

      const data = await res.json()
      setSavedCode(data.shareCode || code)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleCopyLink = () => {
    if (!savedCode) return
    const url = `${window.location.origin}/configurator/${savedCode}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const getCategoryName = (cat: { slug: string; name: string }) => {
    return t.categories[cat.slug] || cat.name
  }

  const requiredCategories = categories.filter(c => c.isRequired)
  const missingCategories = requiredCategories.filter(c => !selections[c.id])
  const isComplete = missingCategories.length === 0

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 pb-28 font-poppins">
      {/* Header */}
      <div className="mb-10">
        <span className="font-cabin text-[11px] uppercase tracking-[0.14em] text-[#1dd8e1] font-semibold block mb-1">
          {t.configurator.summaryEyebrow}
        </span>
        <h1 className="editorial-title text-3xl sm:text-4xl text-[#0a0d0f] tracking-[0.08em]">
          {t.configurator.summaryTitle}
        </h1>
        <div className="w-10 h-0.5 bg-[#1dd8e1] my-3" />
        <p className="text-[14px] text-[#2e3438] mt-1.5 leading-relaxed">
          {t.configurator.summaryDesc}
        </p>
      </div>

      {/* Warnings if missing parts */}
      {!isComplete && (
        <div className="mb-8 p-4 bg-[#fff8eb] border border-[#f5d485] rounded-[3px] text-[13px] text-[#8a5300] space-y-2">
          <p className="font-medium font-cabin uppercase tracking-wider text-[11px]">{t.configurator.incompleteTitle}</p>
          <p className="text-[12px]">
            {t.configurator.incompleteDesc}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {missingCategories.map(cat => {
              const idx = categories.findIndex(c => c.id === cat.id)
              return (
                <button
                  key={cat.id}
                  onClick={() => setCurrentStep(idx)}
                  className="px-2.5 py-1 bg-white border border-[#f5d485] rounded-[3px] font-cabin text-[10px] uppercase tracking-wider font-semibold text-black hover:bg-[#8a5300] hover:text-white transition-colors"
                >
                  {t.configurator.selectCategoryBtn} {getCategoryName(cat)} →
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Two Column Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
        {/* Watch Render Showcase (5 cols) */}
        <div className="lg:col-span-5 bg-[#f7f7f7] border border-[#d5d6d7] rounded-[3px] p-6 flex flex-col items-center justify-center relative sticky top-20">
          <div className="w-full aspect-square relative max-w-[340px]">
            {visualLayers.map(layer => (
              <div
                key={layer.categoryId}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  zIndex: layer.zIndex,
                  opacity: layer.opacity,
                  transform: `scale(${layer.scale}) translate(${layer.x}px, ${layer.y}px) rotate(${layer.rotation}deg)`,
                }}
              >
                <img
                  src={layer.image.replace(/\.svg$/, '.png')}
                  alt={layer.pieceName}
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                />
              </div>
            ))}

            {engravingText && (
              <div className="absolute inset-x-0 bottom-16 text-center z-30 pointer-events-none">
                <span className="font-mono text-[9px] tracking-widest uppercase bg-[#0a0d0f]/80 text-[#1dd8e1] px-2 py-0.5 rounded-[1px]">
                  {engravingText}
                </span>
              </div>
            )}
          </div>

          <div className="w-full pt-4 mt-4 border-t border-[#d5d6d7] text-center">
            <span className="font-cabin text-[9px] uppercase tracking-[0.14em] text-[#2e3438]">
              {t.configurator.renderDisclaimer}
            </span>
          </div>
        </div>

        {/* Detailed Bill of Materials (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-[#d5d6d7] rounded-[3px] bg-[#ffffff] divide-y divide-[#d5d6d7] overflow-hidden">
            <div className="p-4 bg-[#f7f7f7] flex items-center justify-between">
              <span className="font-cabin text-[11px] uppercase tracking-[0.14em] font-semibold text-[#0a0d0f]">
                {t.configurator.breakdownTitle}
              </span>
              <span className="font-cabin text-[10px] text-[#2e3438]">{categories.length} {t.configurator.stepsCount}</span>
            </div>

            {/* Base Watch Line */}
            <div className="p-4 flex items-center justify-between text-[13px]">
              <div>
                <p className="font-poppins font-medium text-[#0a0d0f]">{t.configurator.baseAssemblyTitle}</p>
                <p className="text-[12px] text-[#2e3438]">{t.configurator.baseAssemblyDesc}</p>
              </div>
              <span className="font-mono text-[#0a0d0f] font-semibold">${priceBreakdown.basePrice}</span>
            </div>

            {/* Individual Parts */}
            {categories.map((cat, i) => {
              const piece = selections[cat.id]
              const idx = categories.findIndex(c => c.id === cat.id)

              return (
                <div key={cat.id} className="p-3.5 flex items-center justify-between gap-3 text-[13px]">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-[#2e3438] text-[10px] w-5 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <span className="font-cabin text-[9px] uppercase tracking-wider text-[#2e3438] block">{getCategoryName(cat)}</span>
                      {piece ? (
                        <p className="font-poppins font-medium text-[#0a0d0f] truncate">{piece.name}</p>
                      ) : (
                        <p className="text-[#2e3438] italic text-[12px]">
                          {cat.isRequired ? t.configurator.notSelectedRequired : t.configurator.optionalNotIncluded}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {piece ? (
                      <span className="font-mono text-[#0a0d0f]">
                        {piece.price > 0 ? `+$${piece.price.toFixed(0)}` : '$0'}
                      </span>
                    ) : (
                      <span className="font-cabin text-[11px] text-[#d5d6d7]">—</span>
                    )}
                    <button
                      onClick={() => setCurrentStep(idx)}
                      className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438] hover:text-[#0a0d0f] underline"
                    >
                      {t.configurator.edit}
                    </button>
                  </div>
                </div>
              )
            })}

            {/* Engraving add-on */}
            {engravingText && engravingText.trim().length > 0 && (
              <div className="p-3.5 flex items-center justify-between bg-[#f7f7f7] text-[13px]">
                <div>
                  <span className="font-cabin text-[9px] uppercase tracking-wider text-[#2e3438] block">{t.configurator.laserAddonTitle}</span>
                  <p className="font-mono text-[#0a0d0f]">"{engravingText}" ({engravingFont})</p>
                </div>
                <span className="font-mono text-[#0a0d0f] font-semibold">+$30</span>
              </div>
            )}

            {/* Total Panel (Carbon Ink #0a0d0f with Signal Teal) */}
            <div className="p-5 bg-[#0a0d0f] text-[#ffffff] flex items-center justify-between">
              <div>
                <span className="font-cabin text-[10px] text-white/70 uppercase tracking-[0.14em] block font-semibold">
                  {t.configurator.totalInvestment}
                </span>
                <span className="font-poppins text-[11px] text-white/50">{t.configurator.totalIncludes}</span>
              </div>
              <span className="font-poppins text-2xl font-bold font-mono tabular-nums text-[#ffffff]">
                ${totalPrice.toFixed(0)} <span className="font-cabin text-xs font-semibold text-[#1dd8e1]">USD</span>
              </span>
            </div>
          </div>

          {/* Configuration ID / Save / Share Panel */}
          {savedCode ? (
            <div className="p-5 bg-[#f7f7f7] border border-[#d5d6d7] rounded-[3px] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438] block">
                    {t.configurator.designCodeTitle}
                  </span>
                  <p className="font-mono text-xl font-bold text-[#0a0d0f]">{savedCode}</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="btn-outline-dark text-[10px] py-2 px-3"
                >
                  {copied ? t.configurator.linkCopied : t.configurator.copyLink}
                </button>
              </div>
              <p className="text-[12px] text-[#2e3438] font-poppins">
                Guarda este código para reanudar tu pedido o compartirlo con el taller.
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="btn-outline-dark flex-1 justify-center py-3 text-[11px]"
              >
                {saving ? t.configurator.saving : t.configurator.saveCodeBtn}
              </button>
            </div>
          )}

          {/* Primary Action: Request / Order Watch (WhatsApp Flow) */}
          <div className="pt-2 space-y-2">
            <a
              href={getWhatsAppUrl(
                `¡Hola Taller de Jairo Relojería!\n\n` +
                `Me gustaría encargar la manufactura de este reloj personalizado:\n\n` +
                Object.values(selections).map(s => `• ${s.name} ($${s.price} USD)`).join('\n') +
                (engravingText ? `\n• Grabado Láser: "${engravingText}" (${engravingFont || 'Classic'}) (+$30 USD)` : '') +
                `\n\nInversión Total: $${totalPrice} USD` +
                `\nCódigo de Diseño Oficial: ${savedCode || 'Pendiente'}` +
                `\n\n¿Cuáles son los pasos para confirmar mi encargo y comenzar el ensamble?`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-[3px] bg-[#25D366] hover:bg-[#20ba59] text-white font-cabin text-[12px] font-bold tracking-wider uppercase transition-all duration-200 shadow-md"
            >
              <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>{t.configurator.commissionBtn}</span>
            </a>
            <p className="font-poppins text-[11px] text-[#2e3438] text-center leading-relaxed">
              {t.configurator.commissionDisclaimer}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#d5d6d7]">
            <button
              type="button"
              onClick={reset}
              className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438] hover:text-[#0a0d0f] transition-colors"
            >
              {t.configurator.resetConfig}
            </button>
            <Link href="/catalog" className="font-cabin text-[10px] uppercase tracking-wider text-[#0a0d0f] hover:text-[#1dd8e1]">
              {t.configurator.viewFullCatalog}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
