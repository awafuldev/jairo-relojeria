'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'

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

export default function CatalogClient({ watches }: { watches: Watch[] }) {
  const { t } = useI18n()
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'dive' | 'gmt' | 'classic'>('all')

  const filteredWatches = watches.filter(watch => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'dive') return watch.slug.includes('sub') || watch.slug.includes('skx') || (watch.waterResist && watch.waterResist.includes('200M'))
    if (selectedFilter === 'gmt') return watch.slug.includes('gmt') || (watch.caliber && watch.caliber.includes('GMT'))
    if (selectedFilter === 'classic') return watch.slug.includes('datejust') || watch.slug.includes('explorer')
    return true
  })

  return (
    <div className="space-y-12">
      {/* ── MINIMAL COLLECTION TABS (Blok reference style with Signal Teal active underline) ── */}
      <div className="flex items-center gap-2 sm:gap-6 border-b border-[#d5d6d7] pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setSelectedFilter('all')}
          className={`font-cabin text-[11px] uppercase tracking-[0.12em] py-3 px-2 border-b-2 font-semibold transition-colors whitespace-nowrap ${
            selectedFilter === 'all'
              ? 'border-[#1dd8e1] text-[#0a0d0f]'
              : 'border-transparent text-[#2e3438] hover:text-[#0a0d0f]'
          }`}
        >
          {t.catalog.filterAll} ({watches.length})
        </button>

        <button
          type="button"
          onClick={() => setSelectedFilter('dive')}
          className={`font-cabin text-[11px] uppercase tracking-[0.12em] py-3 px-2 border-b-2 font-semibold transition-colors whitespace-nowrap ${
            selectedFilter === 'dive'
              ? 'border-[#1dd8e1] text-[#0a0d0f]'
              : 'border-transparent text-[#2e3438] hover:text-[#0a0d0f]'
          }`}
        >
          {t.catalog.filterSub}
        </button>

        <button
          type="button"
          onClick={() => setSelectedFilter('gmt')}
          className={`font-cabin text-[11px] uppercase tracking-[0.12em] py-3 px-2 border-b-2 font-semibold transition-colors whitespace-nowrap ${
            selectedFilter === 'gmt'
              ? 'border-[#1dd8e1] text-[#0a0d0f]'
              : 'border-transparent text-[#2e3438] hover:text-[#0a0d0f]'
          }`}
        >
          {t.catalog.filterGmt}
        </button>

        <button
          type="button"
          onClick={() => setSelectedFilter('classic')}
          className={`font-cabin text-[11px] uppercase tracking-[0.12em] py-3 px-2 border-b-2 font-semibold transition-colors whitespace-nowrap ${
            selectedFilter === 'classic'
              ? 'border-[#1dd8e1] text-[#0a0d0f]'
              : 'border-transparent text-[#2e3438] hover:text-[#0a0d0f]'
          }`}
        >
          {t.catalog.filterExplorer}
        </button>
      </div>

      {/* ── 4-COLUMN PRODUCT GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredWatches.map(watch => (
          <div
            key={watch.id}
            className="bg-[#ffffff] border border-[#d5d6d7] hover:border-[#0a0d0f] rounded-[3px] p-6 flex flex-col justify-between group transition-colors"
          >
            <div>
              {/* Product Photograph Container */}
              <div className="aspect-square bg-[#ffffff] rounded-[3px] flex items-center justify-center overflow-hidden mb-5 relative">
                <img
                  src={watch.mainImage}
                  alt={watch.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                {watch.reference && (
                  <span className="absolute top-2 left-2 bg-[#ffffff] border border-[#d5d6d7] text-[#0a0d0f] font-mono text-[9px] px-1.5 py-0.5 rounded-[2px]">
                    {watch.reference}
                  </span>
                )}
                {watch.stock === 0 ? (
                  <span className="absolute top-2 right-2 bg-[#f7f7f7] border border-[#d5d6d7] text-[#2e3438] font-cabin text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-[2px] font-semibold">
                    {t.configurator.outOfStock}
                  </span>
                ) : (
                  <span className="absolute top-2 right-2 bg-[#0a0d0f] text-[#1dd8e1] font-cabin text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-[2px] font-bold">
                    Seiko Mod
                  </span>
                )}
              </div>

              {/* Title & Details */}
              <h2 className="font-poppins font-medium text-[15px] text-[#0a0d0f] leading-snug line-clamp-2">
                {watch.name}
              </h2>

              {watch.caliber && (
                <p className="font-cabin text-[10px] text-[#2e3438] uppercase tracking-wide mt-2 truncate">
                  {t.productDetail.caliber}: <span className="text-[#0a0d0f] font-semibold">{watch.caliber.split('(')[0]}</span>
                </p>
              )}

              {watch.caseSize && (
                <p className="font-cabin text-[10px] text-[#2e3438] mt-1">
                  {t.productDetail.caseSize}: <span className="text-[#0a0d0f]">{watch.caseSize.split('(')[0]}</span>
                </p>
              )}

              {watch.waterResist && (
                <p className="font-cabin text-[10px] text-[#2e3438] mt-0.5">
                  {t.productDetail.waterResist}: <span className="text-[#0a0d0f]">{watch.waterResist.split('(')[0]}</span>
                </p>
              )}
            </div>

            {/* Price & View Detail Action */}
            <div className="mt-6 pt-4 border-t border-[#f7f7f7] flex items-center justify-between">
              <div>
                <span className="font-cabin text-[9px] text-[#2e3438] block uppercase tracking-wider">
                  {t.featuredShowcase.investment}
                </span>
                <span className="font-poppins font-normal text-[16px] text-[#0a0d0f] tabular-nums">
                  ${watch.price.toFixed(0)} <span className="text-[11px] text-[#2e3438]">USD</span>
                </span>
              </div>
              <Link
                href={`/catalog/${watch.slug}`}
                className="font-cabin text-[10px] uppercase tracking-[0.1em] text-[#0a0d0f] group-hover:text-[#1dd8e1] transition-colors font-bold"
              >
                {t.featured.viewWatch} →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
