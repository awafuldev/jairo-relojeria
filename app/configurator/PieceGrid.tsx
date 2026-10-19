'use client'

import { useState } from 'react'
import { useConfiguratorStore } from '@/lib/store'
import { useI18n } from '@/lib/i18n/context'
import type { PieceData } from '@/lib/configurationEngine'

export default function PieceGrid() {
  const {
    categories,
    currentStepIndex,
    availablePieces,
    compatiblePartIds,
    incompatibleParts,
    selections,
    selectPiece,
    clearSelection,
    nextStep,
    prevStep,
    engravingText,
    setEngravingText,
    engravingFont,
    setEngravingFont,
    pendingInvalidation,
    confirmInvalidationChange,
    cancelInvalidationChange,
    isLoadingPieces,
  } = useConfiguratorStore()

  const { t } = useI18n()

  const currentCategory = categories[currentStepIndex]
  const currentSelection = currentCategory ? selections[currentCategory.id] : null
  const [hoveredIncompat, setHoveredIncompat] = useState<string | null>(null)
  const [noneHovered, setNoneHovered] = useState(false)

  const isEngravingStep = currentCategory?.slug === 'engraving'

  if (isLoadingPieces) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-5 h-5 border-2 border-[#d5d6d7] border-t-[#1dd8e1] rounded-full animate-spin mb-3" />
        <span className="font-cabin text-[11px] uppercase tracking-wider text-[#2e3438]">
          {t.configurator.loadingCatalog}
        </span>
      </div>
    )
  }

  // Compatible pieces first
  const compatible = availablePieces.filter((p) => compatiblePartIds.includes(p.id))
  const incompatible = availablePieces.filter((p) => !compatiblePartIds.includes(p.id))

  const handleSelect = (piece: PieceData) => {
    if (!compatiblePartIds.includes(piece.id)) return
    if (piece.stock === 0) return
    selectPiece(piece)
  }

  return (
    <div className="pb-28">
      {/* ── CASCADE INVALIDATION CONFIRMATION MODAL ── */}
      {pendingInvalidation && (
        <div className="fixed inset-0 z-50 bg-[#0a0d0f]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#ffffff] border border-[#d5d6d7] rounded-[3px] max-w-md w-full p-6 shadow-2xl">
            <span className="font-cabin text-[10px] uppercase tracking-[0.14em] text-[#dc2626] font-semibold block mb-1">
              {t.configurator.invalidationTitle}
            </span>
            <h3 className="editorial-title text-[18px] text-[#0a0d0f] mb-3">
              {t.configurator.invalidationQuestion} {pendingInvalidation.newPiece.name}?
            </h3>
            <p className="text-[13px] text-[#2e3438] font-poppins mb-4 leading-relaxed">
              {t.configurator.invalidationDesc}
            </p>

            <div className="p-3.5 bg-[#f7f7f7] rounded-[3px] border border-[#d5d6d7] mb-6 space-y-2 text-[12px] font-poppins">
              {pendingInvalidation.invalidatedList.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-[#0a0d0f]">
                  <span><strong>{item.categoryName}:</strong> {item.invalidPiece.name}</span>
                  <span className="font-cabin text-[10px] text-[#dc2626] uppercase">{item.reason}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={confirmInvalidationChange}
                className="btn-teal flex-1 justify-center py-2.5 text-[11px]"
              >
                {t.configurator.invalidationConfirm}
              </button>
              <button
                type="button"
                onClick={cancelInvalidationChange}
                className="btn-outline-dark flex-1 justify-center py-2.5 text-[11px]"
              >
                {t.configurator.invalidationCancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SPECIAL STEP: ENGRAVING INTERACTIVE TOOL ── */}
      {isEngravingStep ? (
        <div className="max-w-xl mx-auto space-y-8 py-4">
          <div className="border border-[#d5d6d7] rounded-[3px] p-6 bg-[#ffffff] space-y-6">
            <div>
              <label className="font-cabin text-[11px] uppercase tracking-[0.12em] text-[#2e3438] font-semibold block mb-2">
                {t.configurator.laserTitle}
              </label>
              <input
                type="text"
                maxLength={25}
                value={engravingText}
                onChange={(e) => setEngravingText(e.target.value.toUpperCase())}
                placeholder={t.configurator.laserPlaceholder}
                className="w-full px-4 py-3 border border-[#d5d6d7] rounded-[3px] text-[14px] font-mono tracking-widest uppercase focus:outline-none focus:border-[#1dd8e1]"
              />
              <p className="font-poppins text-[12px] text-[#2e3438] mt-1.5 leading-relaxed">
                {t.configurator.laserDesc}
              </p>
            </div>

            <div>
              <label className="font-cabin text-[11px] uppercase tracking-[0.12em] text-[#2e3438] font-semibold block mb-2">
                {t.configurator.fontStyle}
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'classic', label: t.configurator.fontClassic, sample: 'ROMAN SERIF' },
                  { id: 'modern', label: t.configurator.fontModern, sample: 'MONO SANS' },
                  { id: 'script', label: t.configurator.fontScript, sample: 'Italic Script' },
                ].map(font => (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => setEngravingFont(font.id)}
                    className={`p-3 text-left border rounded-[3px] transition-colors ${
                      engravingFont === font.id
                        ? 'border-[#1dd8e1] bg-[#f7f7f7] ring-1 ring-[#1dd8e1]'
                        : 'border-[#d5d6d7] hover:border-[#2e3438]'
                    }`}
                  >
                    <p className="font-cabin text-[11px] uppercase tracking-wider font-semibold text-[#0a0d0f]">{font.label}</p>
                    <p className={`text-[11px] text-[#2e3438] mt-1 ${
                      font.id === 'script' ? 'italic font-serif' : font.id === 'modern' ? 'font-mono' : 'font-serif'
                    }`}>
                      {font.sample}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#f7f7f7] flex justify-between items-center text-[13px] font-poppins">
              <span className="font-cabin text-[11px] uppercase tracking-wider text-[#2e3438]">
                {t.configurator.laserCost}
              </span>
              <span className="font-semibold text-[#0a0d0f]">
                {engravingText.trim().length > 0 ? '+$30 USD' : '$0 USD'}
              </span>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── STANDARD COMPONENT SELECTION GRID (Blok Cards) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {/* ── NONE OPTION — Only for optional categories ── */}
        {currentCategory && !currentCategory.isRequired && (
          <div
            onMouseEnter={() => setNoneHovered(true)}
            onMouseLeave={() => setNoneHovered(false)}
            onClick={() => clearSelection(currentCategory.id)}
            className={`group bg-[#ffffff] border rounded-[3px] transition-all duration-160 flex flex-col justify-between overflow-hidden cursor-pointer ${
              !currentSelection
                ? 'border-[#1dd8e1] ring-1 ring-[#1dd8e1]'
                : noneHovered
                ? 'border-[#2e3438]'
                : 'border-[#d5d6d7] border-dashed hover:border-[#2e3438]'
            }`}
            title={t.configurator.noComponentDesc}
          >
            {/* Visual: crossed-out circle icon on neutral background */}
            <div className="aspect-square bg-[#f7f7f7] relative overflow-hidden flex items-center justify-center p-4 sm:p-5">
              <div className="flex flex-col items-center justify-center gap-2 text-[#2e3438]">
                {/* Icon: circle with diagonal line */}
                <svg
                  width="48" height="48" viewBox="0 0 48 48"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  className={`transition-colors ${!currentSelection ? 'text-[#1dd8e1]' : 'text-[#d5d6d7] group-hover:text-[#2e3438]'}`}
                >
                  <circle cx="24" cy="24" r="18" strokeDasharray="4 3" />
                  <line x1="10" y1="10" x2="38" y2="38" strokeLinecap="round" />
                </svg>
                <span className={`font-cabin text-[9px] uppercase tracking-[0.14em] font-bold transition-colors ${!currentSelection ? 'text-[#1dd8e1]' : 'text-[#2e3438]'}`}>
                  {t.configurator.skipCategory}
                </span>
              </div>

              {/* Checkmark when none is selected (no current selection) */}
              {!currentSelection && (
                <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-[#1dd8e1] text-[#0a0d0f] rounded-full flex items-center justify-center text-[12px] font-bold shadow-xs">
                  ✓
                </div>
              )}
            </div>

            {/* Card info */}
            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <p className="font-mono text-[9px] text-[#d5d6d7]">—</p>
                <h3 className="font-poppins text-[13px] font-medium text-[#0a0d0f] leading-snug mt-1">
                  {t.configurator.noComponentCardTitle}
                </h3>
                <p className="font-cabin text-[10px] uppercase tracking-wide text-[#2e3438] mt-1">
                  {t.configurator.optional}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#f7f7f7] flex items-center justify-between">
                <span className="font-poppins text-[13px] font-semibold text-[#0a0d0f] tabular-nums">
                  +$0
                </span>
                <span className="font-cabin text-[9px] uppercase tracking-wider text-[#2e3438] font-bold">
                  {t.configurator.optional}
                </span>
              </div>
            </div>
          </div>
        )}

        {compatible.map((piece) => {
          const isSelected = currentSelection?.id === piece.id
          const isOutOfStock = piece.stock === 0
          const rawImg = piece.productImage || piece.compositionImage || piece.layerImage || '/images/products/case-sub-40-steel.png'
          const displayImg = rawImg.replace(/\.svg$/, '.png')

          return (
            <div
              key={piece.id}
              onClick={() => !isOutOfStock && handleSelect(piece)}
              className={`group bg-[#ffffff] border rounded-[3px] transition-all duration-160 flex flex-col justify-between overflow-hidden cursor-pointer ${
                isSelected
                  ? 'border-[#1dd8e1] ring-1 ring-[#1dd8e1] bg-[#ffffff]'
                  : 'border-[#d5d6d7] hover:border-[#0a0d0f]'
              }`}
            >
              {/* Product Visual */}
              <div className="aspect-square bg-[#f7f7f7] relative overflow-hidden flex items-center justify-center p-4 sm:p-5">
                <img
                  src={displayImg}
                  alt={piece.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = '/images/products/case-sub-40-steel.png'
                  }}
                />

                {/* Selected Checkmark Badge (Signal Teal) */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-[#1dd8e1] text-[#0a0d0f] rounded-full flex items-center justify-center text-[12px] font-bold shadow-xs">
                    ✓
                  </div>
                )}

                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
                    <span className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438] font-semibold bg-[#ffffff] px-2 py-1 border border-[#d5d6d7] rounded-[2px]">
                      {t.configurator.outOfStock}
                    </span>
                  </div>
                )}
              </div>

              {/* Component Info Card */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <p className="font-mono text-[9px] text-[#2e3438]">{piece.sku}</p>
                  <h3 className="font-poppins text-[13px] font-medium text-[#0a0d0f] leading-snug mt-1 line-clamp-2">
                    {piece.name}
                  </h3>
                  {piece.material && (
                    <p className="font-cabin text-[10px] uppercase tracking-wide text-[#2e3438] mt-1">
                      {piece.material}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#f7f7f7] flex items-center justify-between">
                  <span className="font-poppins text-[13px] font-semibold text-[#0a0d0f] tabular-nums">
                    {piece.price === 0 ? '+$0' : `+$${piece.price.toFixed(0)}`}
                  </span>
                  <span className="font-cabin text-[9px] uppercase tracking-wider text-[#1dd8e1] font-bold">
                    {t.configurator.compatibleBadge}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── INCOMPATIBLE PIECES SECTION (Grayed out with helpful reason) ── */}
      {incompatible.length > 0 && (
        <div className="mt-14 pt-8 border-t border-[#d5d6d7]">
          <div className="mb-4">
            <span className="font-cabin text-[11px] uppercase tracking-[0.14em] text-[#2e3438] font-semibold block">
              {t.configurator.incompatibleTitle} ({incompatible.length})
            </span>
            <p className="text-[12px] text-[#2e3438] font-poppins mt-0.5">
              {t.configurator.incompatibleDesc}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 opacity-50">
            {incompatible.map((piece) => {
              const rule = incompatibleParts[piece.id]
              const rawImg = piece.productImage || piece.compositionImage || piece.layerImage || '/images/products/case-sub-40-steel.png'
              const displayImg = rawImg.replace(/\.svg$/, '.png')

              return (
                <div
                  key={piece.id}
                  className="bg-[#ffffff] border border-[#d5d6d7] rounded-[3px] overflow-hidden cursor-not-allowed group relative"
                  onMouseEnter={() => setHoveredIncompat(piece.id)}
                  onMouseLeave={() => setHoveredIncompat(null)}
                >
                  <div className="aspect-square bg-[#f7f7f7] p-4 flex items-center justify-center relative grayscale">
                    <img
                      src={displayImg}
                      alt={piece.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = '/images/products/case-sub-40-steel.png'
                      }}
                    />

                    {hoveredIncompat === piece.id && (
                      <div className="absolute inset-0 bg-[#0a0d0f]/90 p-3 flex flex-col justify-center items-center text-center transition-opacity">
                        <span className="font-cabin text-[9px] uppercase tracking-wider text-[#1dd8e1] font-bold mb-1">
                          {t.configurator.incompatibleTooltip}
                        </span>
                        <p className="font-poppins text-[10px] text-white/90 leading-tight">
                          {rule ? rule.reason : t.configurator.incompatibleTooltip}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="font-poppins text-[11px] text-[#2e3438] truncate">{piece.name}</p>
                    <p className="font-cabin text-[9px] uppercase tracking-wider text-[#2e3438] mt-0.5">
                      {t.configurator.incompatibleTooltip}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── STICKY BOTTOM NAVIGATION BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-60 xl:left-[520px] bg-[#ffffff]/95 backdrop-blur-md border-t border-[#d5d6d7] px-6 py-4 flex items-center justify-between z-30">
        <div>
          {currentSelection ? (
            <div>
              <span className="font-cabin text-[9px] uppercase tracking-wider text-[#2e3438] block">{t.configurator.selection}</span>
              <p className="font-poppins text-[13px] font-medium text-[#0a0d0f] truncate max-w-xs">{currentSelection.name}</p>
            </div>
          ) : currentCategory?.isRequired ? (
            <p className="font-poppins text-[12px] text-[#2e3438]">{t.configurator.selectToContinue}</p>
          ) : (
            <p className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438]">{t.configurator.optionalStep}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {currentStepIndex > 0 && (
            <button
              type="button"
              onClick={prevStep}
              className="btn-outline-dark text-[10px] py-2.5 px-4"
            >
              {t.configurator.prev}
            </button>
          )}
          <button
            type="button"
            onClick={nextStep}
            disabled={!currentSelection && currentCategory?.isRequired}
            className="btn-teal py-2.5 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {currentStepIndex === categories.length - 1 ? t.configurator.reviewFinal : t.configurator.next}
          </button>
        </div>
      </div>
    </div>
  )
}
