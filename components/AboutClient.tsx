'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useI18n } from '@/lib/i18n/context'
import { getWhatsAppUrl } from '@/lib/whatsapp'

export default function AboutClient() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col font-poppins selection:bg-[#1dd8e1] selection:text-[#0a0d0f]">
      <Navbar />

      {/* Header Banner — Bone Background (#f7f7f7) */}
      <header className="bg-[#f7f7f7] border-b border-[#d5d6d7] py-16 md:py-24">
        <div className="container-blok max-w-3xl">
          <span className="editorial-sub text-[#2e3438]">
            {t.about.eyebrow}
          </span>
          <h1 className="editorial-title text-3xl sm:text-4xl md:text-5xl text-[#0a0d0f] tracking-[0.09em] mt-3">
            {t.about.title}
          </h1>
          <div className="w-10 h-0.5 bg-[#1dd8e1] my-4" />
          <p className="text-[15px] text-[#2e3438] font-poppins leading-relaxed">
            {t.about.subtitle}
          </p>
        </div>
      </header>

      {/* Main Editorial Content */}
      <main className="container-blok max-w-3xl py-16 md:py-24 space-y-16 flex-1">
        {/* Section 1: The Vision */}
        <section className="space-y-4">
          <h2 className="editorial-title text-2xl text-[#0a0d0f] tracking-[0.08em]">
            {t.about.artisanTitle}
          </h2>
          <div className="space-y-4 text-[14px] text-[#2e3438] font-poppins leading-relaxed">
            <p>
              {t.about.artisanDesc}
            </p>
          </div>
        </section>

        {/* Section 2: Craft & Standards */}
        <section className="border-t border-[#d5d6d7] pt-12 space-y-4">
          <h2 className="editorial-title text-2xl text-[#0a0d0f] tracking-[0.08em]">
            {t.about.calibersTitle}
          </h2>
          <div className="space-y-4 text-[14px] text-[#2e3438] font-poppins leading-relaxed">
            <p>
              {t.about.calibersDesc}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#f7f7f7] border border-[#d5d6d7] p-5 rounded-[3px]">
                <h4 className="font-cabin text-[11px] uppercase tracking-[0.12em] font-semibold text-[#0a0d0f] mb-1">
                  {t.craftsmanship.step1Title}
                </h4>
                <p className="text-[12px] text-[#2e3438]">
                  {t.craftsmanship.step1Desc}
                </p>
              </div>
              <div className="bg-[#f7f7f7] border border-[#d5d6d7] p-5 rounded-[3px]">
                <h4 className="font-cabin text-[11px] uppercase tracking-[0.12em] font-semibold text-[#0a0d0f] mb-1">
                  {t.craftsmanship.step3Title}
                </h4>
                <p className="text-[12px] text-[#2e3438]">
                  {t.craftsmanship.step3Desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Official Contact & Community */}
        <section id="contacto" className="border-t border-[#d5d6d7] pt-12 space-y-6">
          <h2 className="editorial-title text-2xl text-[#0a0d0f] tracking-[0.08em]">
            {t.about.contactTitle}
          </h2>
          <p className="text-[14px] text-[#2e3438] font-poppins leading-relaxed">
            {t.about.contactDesc}
          </p>

          <div className="bg-[#f7f7f7] border border-[#d5d6d7] p-6 rounded-[3px] space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-cabin text-[11px] uppercase tracking-[0.12em] font-semibold text-[#0a0d0f] w-28">
                {t.about.contactInstaLabel}:
              </span>
              <a
                href="https://www.instagram.com/jairorelojeria/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-poppins text-[#0a0d0f] hover:text-[#1dd8e1] underline underline-offset-4 transition-colors font-medium"
              >
                @jairorelojeria (Canal Oficial) ↗
              </a>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-cabin text-[11px] uppercase tracking-[0.12em] font-semibold text-[#0a0d0f] w-28">
                WhatsApp:
              </span>
              <a
                href={getWhatsAppUrl('¡Hola Jairo Relojería! Me comunico desde su página web para hacer una consulta sobre sus relojes y servicios.')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-poppins text-[#25D366] hover:underline underline-offset-4 transition-colors font-medium flex items-center gap-1.5"
              >
                +57 310 540 1603 (Atención Directa WhatsApp) ↗
              </a>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-cabin text-[11px] uppercase tracking-[0.12em] font-semibold text-[#0a0d0f] w-28">
                {t.about.contactEmailLabel}:
              </span>
              <a
                href="mailto:taller@jairorelojeria.com"
                className="text-[13px] font-poppins text-[#0a0d0f] hover:text-[#1dd8e1] underline underline-offset-4 transition-colors font-medium"
              >
                taller@jairorelojeria.com
              </a>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-cabin text-[11px] uppercase tracking-[0.12em] font-semibold text-[#0a0d0f] w-28">
                {t.nav.custom}:
              </span>
              <Link
                href="/configurator"
                className="text-[13px] font-poppins text-[#0a0d0f] hover:text-[#1dd8e1] underline underline-offset-4 transition-colors font-medium"
              >
                {t.nav.customizeMyWatch} →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
