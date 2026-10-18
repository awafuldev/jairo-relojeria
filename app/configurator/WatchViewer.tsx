'use client'

import { useState } from 'react'
import { useConfiguratorStore } from '@/lib/store'

export default function WatchViewer() {
  const {
    visualLayers,
    selections,
    categories,
    priceBreakdown,
    totalPrice,
    engravingText,
    engravingFont,
  } = useConfiguratorStore()

  const [viewMode, setViewMode] = useState<'front' | 'back'>('front')
  const [zoom, setZoom] = useState(1.0)

  // Filter layers based on front or back view
  const displayLayers = visualLayers.filter(l => {
    if (viewMode === 'back') {
      // In back view: caseback, movement rotor, strap, and engraving are visible
      return ['caseback', 'movement', 'strap', 'engraving'].includes(l.categorySlug)
    }
    // In front view: all except caseback (unless case is transparent)
    return l.categorySlug !== 'caseback'
  })

  const selectedCount = Object.keys(selections).length

  return (
    <div className="flex flex-col h-full bg-[#f7f7f7] relative overflow-hidden select-none border-r border-[#d5d6d7]">
      {/* Top Floating Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* View Mode Toggle: Front / Back (Blok style with Signal Teal accent) */}
        <div className="inline-flex p-1 bg-[#ffffff]/90 backdrop-blur-md border border-[#d5d6d7] rounded-[3px] pointer-events-auto">
          <button
            type="button"
            onClick={() => setViewMode('front')}
            className={`px-3 py-1.5 font-cabin text-[10px] uppercase tracking-[0.1em] transition-colors rounded-[2px] font-semibold ${
              viewMode === 'front'
                ? 'bg-[#0a0d0f] text-[#1dd8e1]'
                : 'text-[#2e3438] hover:text-[#0a0d0f]'
            }`}
          >
            Esfera Frontal
          </button>
          <button
            type="button"
            onClick={() => setViewMode('back')}
            className={`px-3 py-1.5 font-cabin text-[10px] uppercase tracking-[0.1em] transition-colors rounded-[2px] font-semibold ${
              viewMode === 'back'
                ? 'bg-[#0a0d0f] text-[#1dd8e1]'
                : 'text-[#2e3438] hover:text-[#0a0d0f]'
            }`}
          >
            Fondo Visto / Tapa
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="hidden sm:inline-flex p-1 bg-[#ffffff]/90 backdrop-blur-md border border-[#d5d6d7] rounded-[3px] items-center gap-1 pointer-events-auto">
          <button
            type="button"
            onClick={() => setZoom(prev => Math.max(0.85, prev - 0.1))}
            className="w-6 h-6 flex items-center justify-center text-[13px] text-[#2e3438] hover:text-[#0a0d0f] transition-colors"
            title="Reducir zoom"
            aria-label="Reducir zoom"
          >
            −
          </button>
          <span className="font-mono text-[10px] w-8 text-center text-[#2e3438]">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom(prev => Math.min(1.4, prev + 0.1))}
            className="w-6 h-6 flex items-center justify-center text-[13px] text-[#2e3438] hover:text-[#0a0d0f] transition-colors"
            title="Aumentar zoom"
            aria-label="Aumentar zoom"
          >
            +
          </button>
        </div>
      </div>

      {/* Main Watch Canvas */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        {/* Soft Radial Ambient Pedestal */}
        <div
          className="absolute w-[440px] h-[440px] rounded-full pointer-events-none opacity-40 blur-2xl"
          style={{
            background: 'radial-gradient(circle, #ffffff 30%, rgba(29, 216, 225, 0.08) 60%, transparent 80%)',
          }}
          aria-hidden="true"
        />

        {/* Watch Container with Layer Stack */}
        <div
          className="relative w-full max-w-[460px] aspect-square flex items-center justify-center transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoom})` }}
        >
          {displayLayers.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-8 max-w-xs">
              <div className="w-12 h-12 rounded-full border border-[#d5d6d7] flex items-center justify-center mb-3">
                <span className="font-jost text-[10px] font-bold text-[#0a0d0f] tracking-widest uppercase">JR</span>
              </div>
              <p className="font-jost font-bold text-[14px] text-[#0a0d0f] uppercase tracking-wider">
                Inicia tu Configuración
              </p>
              <p className="text-[12px] text-[#2e3438] font-poppins mt-1 leading-relaxed">
                Selecciona un calibre, caja o dial en el panel para visualizar el ensamble en tiempo real.
              </p>
            </div>
          ) : (
            displayLayers.map((layer) => (
              <div
                key={`${layer.categorySlug}-${layer.pieceId}`}
                className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200"
                style={{
                  zIndex: layer.zIndex,
                  opacity: layer.opacity,
                  transform: `scale(${layer.scale}) translate(${layer.x}px, ${layer.y}px) rotate(${layer.rotation}deg)`,
                }}
              >
                <img
                  src={layer.image.replace(/\.svg$/, '.png')}
                  alt={layer.pieceName}
                  className={`w-full h-full object-contain ${
                    layer.categorySlug === 'crystal' ? '' : 'filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                  }`}
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            ))
          )}

          {/* Real-time Laser Engraving Overlay */}
          {engravingText && engravingText.trim().length > 0 && (
            <div
              className="absolute z-20 pointer-events-none text-center"
              style={{
                top: viewMode === 'back' ? '54%' : '68%',
                transform: 'translateY(-50%)',
              }}
            >
              <span
                className={`text-[10px] tracking-[0.2em] uppercase font-semibold px-2 py-0.5 rounded-[1px] transition-all ${
                  viewMode === 'back'
                    ? 'text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                    : 'text-white/70 drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)] text-[8px]'
                } ${
                  engravingFont === 'script'
                    ? 'italic font-serif'
                    : engravingFont === 'modern'
                    ? 'font-mono'
                    : 'font-serif'
                }`}
              >
                {engravingText}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Live Price & Build Breakdown Drawer */}
      <div className="bg-[#ffffff]/95 backdrop-blur-md border-t border-[#d5d6d7] p-5 shrink-0 z-20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-cabin text-[11px] uppercase tracking-[0.12em] font-semibold text-[#0a0d0f]">
              Especificación Actual
            </span>
            <span className="font-cabin text-[10px] text-[#2e3438]">
              ({selectedCount}/{categories.length} seleccionados)
            </span>
          </div>
          <div className="text-right">
            <span className="font-cabin text-[9px] uppercase tracking-[0.1em] text-[#2e3438] block leading-none">
              Inversión Total
            </span>
            <p className="font-poppins text-[17px] font-semibold tabular-nums text-[#0a0d0f] leading-tight">
              ${totalPrice.toFixed(0)}{' '}
              <span className="font-cabin text-[11px] text-[#1dd8e1] font-bold">USD</span>
            </p>
          </div>
        </div>

        {/* Dynamic Price Breakdown */}
        <div className="text-[11px] font-poppins text-[#2e3438] border-t border-[#f7f7f7] pt-2.5 space-y-1">
          <div className="flex justify-between items-center">
            <span>Ensamble Artesanal & Regulación Suiza</span>
            <span className="font-mono text-[#0a0d0f] font-medium">${priceBreakdown.basePrice}</span>
          </div>
          {priceBreakdown.addons.slice(-3).map((addon, i) => (
            <div key={i} className="flex justify-between items-center text-[#2e3438]">
              <span className="truncate pr-2 font-cabin text-[10px] uppercase tracking-wide">
                {addon.categoryName}: {addon.pieceName}
              </span>
              <span className="font-mono text-[#0a0d0f] shrink-0">
                {addon.price > 0 ? `+$${addon.price}` : '$0'}
              </span>
            </div>
          ))}
          {priceBreakdown.addons.length > 3 && (
            <p className="font-cabin text-[9px] text-[#2e3438] italic pt-0.5">
              + {priceBreakdown.addons.length - 3} componentes adicionales montados
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
