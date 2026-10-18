'use client'

import { useState, useEffect } from 'react'
import { useConfiguratorStore } from '@/lib/store'
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

  // Generate or retrieve bespoke code: e.g. WM-8F42K
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

  const requiredCategories = categories.filter(c => c.isRequired)
  const missingCategories = requiredCategories.filter(c => !selections[c.id])
  const isComplete = missingCategories.length === 0

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 pb-28 font-poppins">
      {/* Header */}
      <div className="mb-10">
        <span className="font-cabin text-[11px] uppercase tracking-[0.14em] text-[#1dd8e1] font-semibold block mb-1">
          Paso Final — Ficha Técnica & Revisión de Ensamble
        </span>
        <h1 className="editorial-title text-3xl sm:text-4xl text-[#0a0d0f] tracking-[0.08em]">
          Tu Reloj Personalizado
        </h1>
        <div className="w-10 h-0.5 bg-[#1dd8e1] my-3" />
        <p className="text-[14px] text-[#2e3438] mt-1.5 leading-relaxed">
          Cada componente ha sido verificado bajo estrictas tolerancias mecánicas. Revisa tu configuración antes de solicitar el encargo al taller de Jairo Relojería.
        </p>
      </div>

      {/* Warnings if missing parts */}
      {!isComplete && (
        <div className="mb-8 p-4 bg-[#fff8eb] border border-[#f5d485] rounded-[3px] text-[13px] text-[#8a5300] space-y-2">
          <p className="font-medium font-cabin uppercase tracking-wider text-[11px]">⚠️ Configuración Incompleta</p>
          <p className="text-[12px]">
            Para poder enviar a manufactura tu reloj, debes seleccionar los siguientes componentes obligatorios:
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
                  Seleccionar {cat.name} →
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
              Renderizado Digital de Ensamble 1:1
            </span>
          </div>
        </div>

        {/* Detailed Bill of Materials (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-[#d5d6d7] rounded-[3px] bg-[#ffffff] divide-y divide-[#d5d6d7] overflow-hidden">
            <div className="p-4 bg-[#f7f7f7] flex items-center justify-between">
              <span className="font-cabin text-[11px] uppercase tracking-[0.14em] font-semibold text-[#0a0d0f]">
                Desglose de Componentes
              </span>
              <span className="font-cabin text-[10px] text-[#2e3438]">{categories.length} Pasos</span>
            </div>

            {/* Base Watch Line */}
            <div className="p-4 flex items-center justify-between text-[13px]">
              <div>
                <p className="font-poppins font-medium text-[#0a0d0f]">Ensamble Maestro & Calibración Suiza</p>
                <p className="text-[12px] text-[#2e3438]">Pruebas de hermeticidad y regulación cronométrica en taller</p>
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
                      <span className="font-cabin text-[9px] uppercase tracking-wider text-[#2e3438] block">{cat.name}</span>
                      {piece ? (
                        <p className="font-poppins font-medium text-[#0a0d0f] truncate">{piece.name}</p>
                      ) : (
                        <p className="text-[#2e3438] italic text-[12px]">
                          {cat.isRequired ? 'No seleccionado (Requerido)' : 'Opcional, no incluido'}
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
                      Editar
                    </button>
                  </div>
                </div>
              )
            })}

            {/* Engraving add-on */}
            {engravingText && engravingText.trim().length > 0 && (
              <div className="p-3.5 flex items-center justify-between bg-[#f7f7f7] text-[13px]">
                <div>
                  <span className="font-cabin text-[9px] uppercase tracking-wider text-[#2e3438] block">Grabado Láser de Fibra</span>
                  <p className="font-mono text-[#0a0d0f]">"{engravingText}" ({engravingFont})</p>
                </div>
                <span className="font-mono text-[#0a0d0f] font-semibold">+$30</span>
              </div>
            )}

            {/* Total Panel (Carbon Ink #0a0d0f with Signal Teal) */}
            <div className="p-5 bg-[#0a0d0f] text-[#ffffff] flex items-center justify-between">
              <div>
                <span className="font-cabin text-[10px] text-white/70 uppercase tracking-[0.14em] block font-semibold">
                  Inversión Total
                </span>
                <span className="font-poppins text-[11px] text-white/50">Incluye ensamble, ajuste y prueba en taller</span>
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
                    Código de Diseño Oficial:
                  </span>
                  <p className="font-mono text-xl font-bold text-[#0a0d0f]">{savedCode}</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="btn-outline-dark text-[10px] py-2 px-3"
                >
                  {copied ? '✓ Enlace Copiado' : 'Copiar Enlace'}
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
                {saving ? 'Guardando...' : 'Guardar y Generar Código de Diseño (JR-ID)'}
              </button>
            </div>
          )}

          {/* Primary Action: Request / Order Watch (Email Client Flow) */}
          <div className="pt-2 space-y-2">
            <a
              href={`mailto:${contactEmail}?subject=Solicitud de Reloj Personalizado ${savedCode || 'Jairo Relojería'}&body=Hola Taller de Jairo Relojería,%0D%0A%0D%0AMe gustaría encargar la manufactura de este reloj personalizado con el siguiente desglose:%0D%0A${encodeURIComponent(
                Object.values(selections).map(s => `- ${s.name} ($${s.price})`).join('\n')
              )}%0D%0A%0D%0AGrabado: ${engravingText || 'Ninguno'}%0D%0ATotal: $${totalPrice} USD%0D%0ACódigo de Diseño: ${savedCode || 'Pendiente'}`}
              className="btn-teal w-full justify-center py-4 text-[12px] tracking-wider uppercase font-semibold"
            >
              Solicitar Encargo al Taller de Jairo Relojería →
            </a>
            <p className="font-poppins text-[11px] text-[#2e3438] text-center leading-relaxed">
              * Al pulsar este botón se abrirá tu programa de correo predeterminado con el desglose completo y código oficial para confirmar detalles con el relojero.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#d5d6d7]">
            <button
              type="button"
              onClick={reset}
              className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438] hover:text-[#0a0d0f] transition-colors"
            >
              Reiniciar configuración desde cero
            </button>
            <Link href="/catalog" className="font-cabin text-[10px] uppercase tracking-wider text-[#0a0d0f] hover:text-[#1dd8e1]">
              Ver catálogo completo de piezas →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
