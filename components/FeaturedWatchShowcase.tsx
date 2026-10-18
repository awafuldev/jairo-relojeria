'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Watch {
  id: string
  name: string
  slug: string
  reference?: string
  price: number
  stock: number
  isAvailable: boolean
  isFeatured: boolean
  caliber?: string
  caseSize?: string
  waterResist?: string
  description?: string
  mainImage: string
}

export default function FeaturedWatchShowcase({ watches }: { watches: Watch[] }) {
  const [activeHeroWatch, setActiveHeroWatch] = useState<Watch>(watches[0])
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const supportingWatches = watches.filter(w => w.id !== activeHeroWatch.id)

  return (
    <div className="space-y-12">
      {/* ── ASYMMETRICAL EDITORIAL GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* HERO FEATURED WATCH (7 cols): Dominant, Architectural Stage */}
        <div className="lg:col-span-7 bg-[#ffffff] border border-[#d5d6d7] hover:border-[#0a0d0f] rounded-[3px] p-8 sm:p-12 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden">
          {/* Subtle Background Accent Gradient */}
          <div
            className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full pointer-events-none opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
            style={{
              background: 'radial-gradient(circle, #1dd8e1 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />

          {/* Eyebrow & Badges */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <span className="font-cabin text-[10px] uppercase tracking-[0.16em] text-[#1dd8e1] font-bold bg-[#0a0d0f] px-3 py-1 rounded-[2px]">
              Modelo Destacado de Taller
            </span>
            {activeHeroWatch.reference && (
              <span className="font-mono text-[11px] text-[#2e3438] bg-[#f7f7f7] border border-[#d5d6d7] px-2.5 py-0.5 rounded-[2px]">
                Ref: {activeHeroWatch.reference}
              </span>
            )}
          </div>

          {/* Large Focused Product Image with Hover Zoom */}
          <div className="aspect-square max-h-[460px] flex items-center justify-center my-6 relative z-10 overflow-hidden">
            <img
              src={activeHeroWatch.mainImage}
              alt={activeHeroWatch.name}
              className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.14)] transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Detailed Typography & Direct Action */}
          <div className="pt-6 border-t border-[#f7f7f7] relative z-10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h3 className="editorial-title text-2xl sm:text-3xl text-[#0a0d0f] tracking-[0.08em] leading-tight">
                  {activeHeroWatch.name}
                </h3>
                {activeHeroWatch.caliber && (
                  <p className="font-cabin text-[11px] uppercase tracking-wider text-[#2e3438] mt-1.5">
                    Calibre: <span className="text-[#0a0d0f] font-semibold">{activeHeroWatch.caliber.split('(')[0]}</span> • Caja: {activeHeroWatch.caseSize?.split('(')[0] || 'Acero 316L'}
                  </p>
                )}
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438] block">Inversión</span>
                <span className="font-poppins text-2xl font-bold text-[#0a0d0f] tabular-nums">
                  ${activeHeroWatch.price.toFixed(0)} <span className="text-xs font-normal text-[#2e3438]">USD</span>
                </span>
              </div>
            </div>

            {activeHeroWatch.description && (
              <p className="text-[13px] text-[#2e3438] font-poppins leading-relaxed line-clamp-2">
                {activeHeroWatch.description}
              </p>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href={`/catalog/${activeHeroWatch.slug}`}
                className="btn-teal justify-center py-3.5 text-[11px]"
              >
                Ver Ficha Técnica Completa →
              </Link>
              <Link
                href="/configurator"
                className="btn-outline-dark justify-center py-3.5 text-[11px]"
              >
                Personalizar este Estilo
              </Link>
            </div>
          </div>
        </div>

        {/* SUPPORTING PRODUCTS (5 cols): Asymmetrical Stack */}
        <div className="lg:col-span-5 flex flex-col gap-5 justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#d5d6d7]">
            <span className="font-cabin text-[11px] uppercase tracking-[0.14em] text-[#2e3438] font-semibold">
              Otras Piezas en Taller ({supportingWatches.length})
            </span>
            <span className="font-cabin text-[10px] text-[#1dd8e1] font-bold uppercase tracking-wider">
              Toca para inspeccionar
            </span>
          </div>

          {supportingWatches.slice(0, 3).map(watch => {
            const isHovered = hoveredId === watch.id

            return (
              <div
                key={watch.id}
                onMouseEnter={() => setHoveredId(watch.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setActiveHeroWatch(watch)}
                className={`bg-[#ffffff] border rounded-[3px] p-5 flex items-center gap-5 transition-all duration-200 cursor-pointer ${
                  isHovered
                    ? 'border-[#0a0d0f] shadow-md translate-x-1'
                    : 'border-[#d5d6d7] hover:border-[#2e3438]'
                }`}
              >
                {/* Watch Thumbnail */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#f7f7f7] border border-[#d5d6d7] rounded-[2px] p-2 flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={watch.mainImage}
                    alt={watch.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    {watch.reference && (
                      <span className="font-mono text-[9px] text-[#2e3438]">
                        {watch.reference}
                      </span>
                    )}
                    <span className="font-cabin text-[9px] uppercase tracking-wider text-[#1dd8e1] font-bold">
                      Seiko Mod
                    </span>
                  </div>

                  <h4 className="font-poppins font-medium text-[14px] text-[#0a0d0f] leading-snug truncate">
                    {watch.name}
                  </h4>

                  <p className="font-cabin text-[10px] text-[#2e3438] mt-0.5 truncate">
                    {watch.caliber?.split('(')[0] || 'Calibre Automático'}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-poppins font-semibold text-[14px] text-[#0a0d0f]">
                      ${watch.price.toFixed(0)} <span className="text-[10px] font-normal text-[#2e3438]">USD</span>
                    </span>

                    <span className="font-cabin text-[10px] uppercase tracking-wider text-[#0a0d0f] font-bold group-hover:text-[#1dd8e1]">
                      Inspeccionar ↑
                    </span>
                  </div>
                </div>
              </div>
            )
          })}

          <div className="pt-2">
            <Link
              href="/catalog"
              className="w-full btn-outline-dark justify-center py-3 text-[11px] block text-center"
            >
              Explorar Catálogo Completo (6 Modelos) →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
