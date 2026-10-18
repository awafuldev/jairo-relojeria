'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CatalogClient from './CatalogClient'
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

export default function CatalogPageClient({ watches }: { watches: Watch[] }) {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col font-poppins selection:bg-[#1dd8e1] selection:text-[#0a0d0f]">
      <Navbar />

      {/* Header Banner — Editorial Style */}
      <header className="bg-[#ffffff] border-b border-[#d5d6d7] py-14 md:py-20">
        <div className="container-blok">
          <div className="max-w-2xl space-y-3">
            <span className="editorial-sub text-[#2e3438]">
              {t.catalog.eyebrow}
            </span>
            <h1 className="editorial-title text-3xl sm:text-4xl md:text-5xl text-[#0a0d0f] tracking-[0.09em]">
              {t.catalog.title}
            </h1>
            <div className="w-12 h-0.5 bg-[#1dd8e1] my-2" />
            <p className="text-[14px] text-[#2e3438] font-poppins leading-relaxed">
              {t.catalog.subtitle}
            </p>
            <p className="font-cabin text-[11px] uppercase tracking-wider text-[#2e3438]">
              {watches.length} {t.catalog.watchesAvailable}
            </p>
          </div>
        </div>
      </header>

      {/* Main Watches Grid with Filtering */}
      <main className="container-blok py-12 md:py-16 flex-1 space-y-16">
        <CatalogClient watches={watches} />

        {/* Banner connecting to the Configurator */}
        <section className="bg-[#f7f7f7] border border-[#d5d6d7] p-8 md:p-12 rounded-[3px] text-center space-y-4">
          <span className="editorial-sub text-[#2e3438]">
            {t.studioBanner.tag}
          </span>
          <h3 className="editorial-title text-2xl sm:text-3xl text-[#0a0d0f] tracking-[0.08em]">
            {t.studioBanner.title}
          </h3>
          <p className="text-[13px] text-[#2e3438] max-w-xl mx-auto leading-relaxed">
            {t.studioBanner.desc}
          </p>
          <div className="pt-2">
            <Link href="/configurator" className="btn-outline-dark text-[11px]">
              {t.studioBanner.button} →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
