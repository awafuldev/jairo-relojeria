'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FeaturedWatchShowcase from '@/components/FeaturedWatchShowcase'
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

export default function HomeClient({ watches }: { watches: Watch[] }) {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col font-poppins selection:bg-[#1dd8e1] selection:text-[#0a0d0f]">
      <Navbar />

      {/* ── 1. CINEMATIC ART-DIRECTED HERO ── */}
      <section className="relative bg-[#0a0d0f] text-[#ffffff] min-h-[92vh] flex items-center overflow-hidden pt-24 pb-16 md:py-28 lg:py-32">
        {/* Subtle Architectural Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
          aria-hidden="true"
        />

        {/* Ambient Glows */}
        <div
          className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[420px] sm:w-[600px] md:w-[740px] lg:w-[860px] h-[420px] sm:h-[600px] md:h-[740px] lg:h-[860px] rounded-full pointer-events-none opacity-25 blur-3xl animate-pulse-glow"
          style={{
            background: 'radial-gradient(circle, #1dd8e1 0%, rgba(29, 216, 225, 0.45) 45%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute left-[15%] bottom-[10%] w-[320px] h-[320px] rounded-full pointer-events-none opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #1dd8e1 0%, transparent 65%)',
          }}
          aria-hidden="true"
        />

        <div className="container-blok relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Typography & CTAs (7 cols) */}
            <div className="lg:col-span-7 space-y-8 animate-hero-fade">
              {/* Campaign Eyebrow Badge */}
              <div className="inline-flex items-center gap-3 px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-[3px] backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-[#1dd8e1] animate-pulse" />
                <span className="font-cabin text-[10px] uppercase tracking-[0.2em] text-white/90 font-semibold">
                  {t.hero.eyebrow}
                </span>
              </div>

              {/* Architectural Headline */}
              <h1 className="editorial-title text-4xl sm:text-5xl md:text-6xl lg:text-[70px] text-white tracking-[0.08em] leading-[0.98]">
                {t.hero.titleLine1}<br />
                <span className="text-[#1dd8e1]">{t.hero.titleLine2}</span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-[15px] sm:text-[16px] text-white/80 max-w-xl font-poppins leading-relaxed font-normal">
                {t.hero.subtitle}
              </p>

              {/* Interactive CTA Path */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link href="/catalog" className="btn-outline-light text-[11px] py-4 px-8 tracking-[0.14em]">
                  {t.hero.ctaExplore} →
                </Link>
                <Link href="/configurator" className="btn-teal text-[11px] py-4 px-8 tracking-[0.14em]">
                  {t.hero.ctaCustomize}
                </Link>
              </div>

              {/* Horological Craftsmanship Indicator Strip */}
              <div className="pt-10 border-t border-white/10 grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <div className="font-jost text-2xl font-bold text-white tracking-[0.06em]">NH34/35</div>
                  <div className="font-cabin text-[10px] uppercase tracking-[0.12em] text-white/50 mt-1">{t.hero.specCaliber}</div>
                </div>
                <div>
                  <div className="font-jost text-2xl font-bold text-[#1dd8e1] tracking-[0.06em]">316L</div>
                  <div className="font-cabin text-[10px] uppercase tracking-[0.12em] text-white/50 mt-1">Acero Quirúrgico</div>
                </div>
                <div>
                  <div className="font-jost text-2xl font-bold text-white tracking-[0.06em]">100M+</div>
                  <div className="font-cabin text-[10px] uppercase tracking-[0.12em] text-white/50 mt-1">{t.hero.specTest}</div>
                </div>
              </div>
            </div>

            {/* Right Column: Complete Seiko Watch Protagonist (5 cols) */}
            <div className="lg:col-span-5 flex items-center justify-center relative animate-hero-watch">
              <div className="relative w-[320px] sm:w-[420px] md:w-[480px] aspect-square flex items-center justify-center">
                <img
                  src="/images/watches/hero-seiko-watch.png"
                  alt="Reloj Seiko Mod Completo — Jairo Relojería"
                  className="w-full h-full object-contain filter drop-shadow-[0_24px_50px_rgba(0,0,0,0.92)] select-none animate-float"
                />

                <div className="absolute -bottom-2 right-2 bg-[#0a0d0f]/90 border border-white/15 px-3 py-1.5 rounded-[2px] backdrop-blur-md hidden sm:block">
                  <span className="font-mono text-[10px] text-white/80 block">Ref: JR-SUB-40BK</span>
                  <span className="font-cabin text-[8px] uppercase tracking-wider text-[#1dd8e1] font-bold">Zafiro • Bisel Cerámica</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. FEATURED WATCH SHOWCASE ── */}
      <section className="py-24 md:py-32 bg-[#ffffff] border-b border-[#d5d6d7]">
        <div className="container-blok">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="editorial-sub text-[#2e3438]">
                {t.featured.tag}
              </span>
              <h2 className="editorial-title text-3xl sm:text-4xl md:text-5xl text-[#0a0d0f] tracking-[0.08em]">
                {t.featured.title}
              </h2>
              <p className="text-[14px] sm:text-[15px] text-[#2e3438] font-poppins leading-relaxed">
                {t.featured.desc}
              </p>
            </div>

            <div>
              <Link href="/catalog" className="btn-outline-dark text-[11px] py-3 px-6">
                {t.featured.viewAllCatalog} ({watches.length}) →
              </Link>
            </div>
          </div>

          <FeaturedWatchShowcase watches={watches} />
        </div>
      </section>

      {/* ── 3. SHOP BY COLLECTION ── */}
      <section className="py-24 md:py-32 bg-[#f7f7f7] border-b border-[#d5d6d7]">
        <div className="container-blok">
          <div className="mb-14 space-y-2">
            <span className="editorial-sub text-[#2e3438]">
              {t.nav.watches}
            </span>
            <h2 className="editorial-title text-3xl sm:text-4xl text-[#0a0d0f] tracking-[0.08em]">
              Colecciones Seiko
            </h2>
            <p className="text-[14px] text-[#2e3438] font-poppins max-w-xl">
              Nuestros relojes abarcan desde herramientas de inmersión certificadas hasta piezas clásicas de vestir con biseles estriados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Collection 1: Diver & Submariner */}
            <Link
              href="/catalog"
              className="group bg-[#ffffff] border border-[#d5d6d7] hover:border-[#0a0d0f] rounded-[3px] p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
            >
              <div>
                <span className="font-cabin text-[10px] uppercase tracking-[0.16em] text-[#1dd8e1] font-bold block mb-2">
                  Colección 01
                </span>
                <h3 className="editorial-title text-2xl text-[#0a0d0f] tracking-[0.06em]">
                  Diver & Submariner
                </h3>
                <p className="font-poppins text-[12px] text-[#2e3438] mt-2 leading-relaxed">
                  Biseles cerámicos de 120 clics, coronas roscadas herméticas y cajas de acero macizo con resistencia de 100M a 200M.
                </p>
              </div>

              <div className="aspect-square my-6 flex items-center justify-center overflow-hidden">
                <img
                  src="/images/watches/seiko-submariner-black.png"
                  alt="Seiko Diver Collection"
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.1)]"
                />
              </div>

              <div className="pt-4 border-t border-[#f7f7f7] flex items-center justify-between">
                <span className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438]">Desde $395 USD</span>
                <span className="font-cabin text-[11px] uppercase tracking-[0.1em] text-[#0a0d0f] font-bold group-hover:text-[#1dd8e1] transition-colors">
                  {t.featured.viewWatch} →
                </span>
              </div>
            </Link>

            {/* Collection 2: GMT Dual Time */}
            <Link
              href="/catalog"
              className="group bg-[#ffffff] border border-[#d5d6d7] hover:border-[#0a0d0f] rounded-[3px] p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
            >
              <div>
                <span className="font-cabin text-[10px] uppercase tracking-[0.16em] text-[#1dd8e1] font-bold block mb-2">
                  Colección 02
                </span>
                <h3 className="editorial-title text-2xl text-[#0a0d0f] tracking-[0.06em]">
                  GMT Dual Time
                </h3>
                <p className="font-poppins text-[12px] text-[#2e3438] mt-2 leading-relaxed">
                  Calibre mecánico Seiko NH34 con aguja de segundo huso horario independiente y bisel graduado 24 horas bicolor.
                </p>
              </div>

              <div className="aspect-square my-6 flex items-center justify-center overflow-hidden">
                <img
                  src="/images/watches/seiko-gmt-batman.png"
                  alt="Seiko GMT Dual Time"
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.1)]"
                />
              </div>

              <div className="pt-4 border-t border-[#f7f7f7] flex items-center justify-between">
                <span className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438]">Desde $440 USD</span>
                <span className="font-cabin text-[11px] uppercase tracking-[0.1em] text-[#0a0d0f] font-bold group-hover:text-[#1dd8e1] transition-colors">
                  {t.featured.viewWatch} →
                </span>
              </div>
            </Link>

            {/* Collection 3: Explorer & Clásicos */}
            <Link
              href="/catalog"
              className="group bg-[#ffffff] border border-[#d5d6d7] hover:border-[#0a0d0f] rounded-[3px] p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
            >
              <div>
                <span className="font-cabin text-[10px] uppercase tracking-[0.16em] text-[#1dd8e1] font-bold block mb-2">
                  Colección 03
                </span>
                <h3 className="editorial-title text-2xl text-[#0a0d0f] tracking-[0.06em]">
                  Explorer & Clásicos
                </h3>
                <p className="font-poppins text-[12px] text-[#2e3438] mt-2 leading-relaxed">
                  Proporciones atemporales de 36mm a 39mm, calibres sin fecha no-date NH38 o biseles estriados pulidos a espejo.
                </p>
              </div>

              <div className="aspect-square my-6 flex items-center justify-center overflow-hidden">
                <img
                  src="/images/watches/seiko-explorer-39.png"
                  alt="Seiko Explorer Collection"
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.1)]"
                />
              </div>

              <div className="pt-4 border-t border-[#f7f7f7] flex items-center justify-between">
                <span className="font-cabin text-[10px] uppercase tracking-wider text-[#2e3438]">Desde $360 USD</span>
                <span className="font-cabin text-[11px] uppercase tracking-[0.1em] text-[#0a0d0f] font-bold group-hover:text-[#1dd8e1] transition-colors">
                  {t.featured.viewWatch} →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. CRAFTSMANSHIP SECTION ── */}
      <section className="py-24 md:py-36 bg-[#0a0d0f] text-[#ffffff] border-b border-white/10">
        <div className="container-blok">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Col: Photos */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square bg-[#050708] border border-white/10 rounded-[3px] p-4 flex items-center justify-center overflow-hidden group">
                  <img
                    src="/images/craftsmanship/dial-macro-craft.png"
                    alt="Macro detalle esfera y agujas"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-[3px]">
                  <span className="font-cabin text-[9px] uppercase tracking-widest text-[#1dd8e1] font-bold block mb-1">
                    Acabado de Esfera
                  </span>
                  <p className="font-poppins text-[11px] text-white/70">
                    Índices aplicados a mano con tratamiento luminiscente BGW9 Super-LumiNova.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="p-4 bg-white/5 border border-white/10 rounded-[3px]">
                  <span className="font-cabin text-[9px] uppercase tracking-widest text-[#1dd8e1] font-bold block mb-1">
                    Mecánica Seiko NH
                  </span>
                  <p className="font-poppins text-[11px] text-white/70">
                    21.600 alternancias por hora, 24 rubíes y parada de segundero para ajuste exacto.
                  </p>
                </div>
                <div className="aspect-square bg-[#050708] border border-white/10 rounded-[3px] p-4 flex items-center justify-center overflow-hidden group">
                  <img
                    src="/images/craftsmanship/movement-craft.png"
                    alt="Calibre Seiko NH Automático"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Col: Horological Discipline */}
            <div className="lg:col-span-6 space-y-8">
              <span className="editorial-sub text-[#1dd8e1]">
                {t.craftsmanship.eyebrow}
              </span>
              <h2 className="editorial-title text-3xl sm:text-4xl md:text-5xl text-white tracking-[0.08em] leading-tight">
                {t.craftsmanship.title}
              </h2>
              <p className="text-[15px] text-white/75 font-poppins leading-relaxed">
                Cada reloj que sale de nuestro taller es tratado como una pieza individual. No trabajamos en masa: cada calibre es regulado en cronocomparador en 5 posiciones para asegurar una desviación mínima diaria.
              </p>

              <div className="space-y-4 pt-2 border-t border-white/10">
                <div className="flex items-start gap-4">
                  <span className="font-jost text-xl font-bold text-[#1dd8e1]">01</span>
                  <div>
                    <h4 className="font-poppins font-medium text-[14px] text-white">{t.craftsmanship.step1Title}</h4>
                    <p className="text-[12px] text-white/60">{t.craftsmanship.step1Desc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="font-jost text-xl font-bold text-[#1dd8e1]">02</span>
                  <div>
                    <h4 className="font-poppins font-medium text-[14px] text-white">{t.craftsmanship.step2Title}</h4>
                    <p className="text-[12px] text-white/60">{t.craftsmanship.step2Desc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="font-jost text-xl font-bold text-[#1dd8e1]">03</span>
                  <div>
                    <h4 className="font-poppins font-medium text-[14px] text-white">{t.craftsmanship.step3Title}</h4>
                    <p className="text-[12px] text-white/60">{t.craftsmanship.step3Desc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. CUSTOM WATCH STUDIO CTA ── */}
      <section className="py-24 md:py-32 bg-[#ffffff] border-b border-[#d5d6d7]">
        <div className="container-blok">
          <div className="bg-[#f7f7f7] border border-[#d5d6d7] rounded-[3px] p-8 sm:p-14 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ffffff] border border-[#d5d6d7] rounded-[2px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1dd8e1]" />
                  <span className="font-cabin text-[10px] uppercase tracking-[0.14em] text-[#0a0d0f] font-bold">
                    {t.studioBanner.tag}
                  </span>
                </div>

                <h2 className="editorial-title text-3xl sm:text-4xl md:text-5xl text-[#0a0d0f] tracking-[0.08em] leading-tight">
                  {t.studioBanner.title}
                </h2>

                <p className="text-[14px] sm:text-[15px] text-[#2e3438] font-poppins leading-relaxed">
                  {t.studioBanner.desc}
                </p>

                <div className="pt-3 flex flex-col sm:flex-row gap-4">
                  <Link href="/configurator" className="btn-teal py-4 px-8 text-[11px]">
                    {t.studioBanner.button} →
                  </Link>
                  <Link href="/catalog" className="btn-outline-dark py-4 px-8 text-[11px]">
                    {t.hero.ctaExplore}
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#ffffff] border border-[#d5d6d7] rounded-[3px] p-8 text-center space-y-5 shadow-xs">
                <div className="aspect-square max-w-[280px] mx-auto flex items-center justify-center">
                  <img
                    src="/images/watches/seiko-submariner-black.png"
                    alt="Configurador interactivo"
                    className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
                  />
                </div>
                <div>
                  <span className="font-cabin text-[10px] uppercase tracking-[0.14em] text-[#1dd8e1] font-bold block">
                    Visor de Ensamble 1:1
                  </span>
                  <p className="font-poppins text-[12px] text-[#2e3438] mt-1">
                    Validación anatómica de capas, cálculo de presupuesto en vivo y código oficial JR para encargar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. FINAL IMMERSIVE CONVERSION MOMENT ── */}
      <section className="py-24 md:py-36 bg-[#0a0d0f] text-[#ffffff] relative overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #1dd8e1 0%, transparent 65%)',
          }}
          aria-hidden="true"
        />

        <div className="container-blok relative z-10 text-center space-y-8 max-w-3xl mx-auto">
          <span className="font-cabin text-[11px] uppercase tracking-[0.2em] text-[#1dd8e1] font-bold block">
            Jairo Relojería
          </span>

          <h2 className="editorial-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-[0.09em] leading-tight">
            {t.finalConversion.title}
          </h2>

          <p className="text-[15px] sm:text-[16px] text-white/75 font-poppins leading-relaxed max-w-xl mx-auto">
            {t.finalConversion.desc}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/catalog" className="btn-teal py-4 px-9 text-[11px] w-full sm:w-auto">
              {t.finalConversion.ctaCatalog} →
            </Link>
            <Link href="/configurator" className="btn-outline-light py-4 px-9 text-[11px] w-full sm:w-auto">
              {t.finalConversion.ctaCustom}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
