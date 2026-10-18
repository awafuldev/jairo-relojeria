'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WatchDetailClient from './WatchDetailClient'
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
  glass?: string
  waterResist?: string
  bracelet?: string
  description?: string
  mainImage: string
  gallery: string[]
}

export default function WatchDetailPageClient({ watch }: { watch: Watch }) {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col font-poppins selection:bg-[#1dd8e1] selection:text-[#0a0d0f]">
      <Navbar />

      <main className="container-blok py-12 md:py-16 flex-1">
        {/* Minimal Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 font-cabin text-[11px] uppercase tracking-wider text-[#2e3438]">
          <Link href="/" className="hover:text-[#0a0d0f]">{t.nav.home}</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-[#0a0d0f]">{t.nav.watches}</Link>
          <span>/</span>
          <span className="text-[#0a0d0f] font-semibold">{watch.name}</span>
        </div>

        {/* 2-Column Product Detail Layout */}
        <WatchDetailClient watch={watch} />
      </main>

      <Footer />
    </div>
  )
}
