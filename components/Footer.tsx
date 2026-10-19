'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'
import { getWhatsAppUrl } from '@/lib/whatsapp'

export default function Footer() {
  const { t } = useI18n()

  return (
    <footer className="bg-[#efefef] border-t border-[#d5d6d7] text-[#0a0d0f] pt-16 pb-12">
      <div className="container-blok">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-[#d5d6d7]">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <h3 className="font-jost font-bold text-lg uppercase tracking-[0.16em] text-[#0a0d0f]">
              Jairo Relojería
            </h3>
            <p className="text-[13px] text-[#2e3438] max-w-sm leading-relaxed font-poppins">
              {t.footer.brandDesc}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
              <a
                href="https://www.instagram.com/jairorelojeria/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-cabin text-[11px] uppercase tracking-[0.1em] text-[#0a0d0f] hover:text-[#1dd8e1] transition-colors"
              >
                <span>Instagram @jairorelojeria</span>
                <span>↗</span>
              </a>
              <span className="hidden sm:inline text-[#d5d6d7]">|</span>
              <a
                href={getWhatsAppUrl('¡Hola Jairo Relojería! Me comunico desde su sitio web.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-cabin text-[11px] uppercase tracking-[0.1em] text-[#25D366] hover:underline transition-colors font-medium"
              >
                <span>WhatsApp (+57 310-540-1603)</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-cabin text-[11px] uppercase tracking-[0.14em] text-[#2e3438] font-semibold">
              {t.footer.collectionsTitle}
            </h4>
            <ul className="space-y-2 text-[13px] font-poppins">
              <li>
                <Link href="/catalog" className="text-[#0a0d0f] hover:text-[#1dd8e1] transition-colors">
                  {t.nav.watches}
                </Link>
              </li>
              <li>
                <Link href="/configurator" className="text-[#0a0d0f] hover:text-[#1dd8e1] transition-colors">
                  {t.nav.custom}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#0a0d0f] hover:text-[#1dd8e1] transition-colors">
                  {t.nav.atelierAndContact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Service info */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-cabin text-[11px] uppercase tracking-[0.14em] text-[#2e3438] font-semibold">
              {t.footer.servicesTitle}
            </h4>
            <p className="text-[13px] text-[#2e3438] leading-relaxed font-poppins">
              {t.about.artisanDesc}
            </p>
            <p className="font-cabin text-[11px] uppercase tracking-[0.1em] text-[#2e3438] pt-1">
              {t.footer.disclaimer}
            </p>
          </div>
        </div>

        {/* Bottom row: Copyright, Admin Links & CETU STUDIOS Signature */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[12px] text-[#2e3438] font-poppins">
          <p>© {new Date().getFullYear()} Jairo Relojería. {t.footer.rights}</p>

          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-[#0a0d0f] transition-colors">
              {t.nav.atelierAndContact}
            </Link>
            <Link href="/admin/login" className="hover:text-[#0a0d0f] transition-colors">
              Admin
            </Link>
          </div>

          {/* CETU STUDIOS Credit Badge (Matching EBC Dominicana project implementation) */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#0a0d0f] border border-[#2e3438] hover:border-[#1dd8e1]/60 transition-all duration-300 group shadow-sm">
            <span className="text-[11px] text-[#d5d6d7] tracking-wider uppercase font-medium font-cabin">
              {t.footer.madeBy}
            </span>
            <div className="flex items-center gap-2">
              <img
                src="/cetu-studios.png"
                alt="CETU Studios Logo"
                className="h-6 w-auto object-contain brightness-125 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform duration-300"
              />
              <span className="text-[#ffffff] font-bold tracking-wider text-xs font-cabin group-hover:text-[#1dd8e1] transition-colors">
                CETU STUDIOS
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
