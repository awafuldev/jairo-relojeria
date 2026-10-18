'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/lib/cartStore'
import { useI18n } from '@/lib/i18n/context'
import CartDrawer from './CartDrawer'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { toggleCart, totalCount } = useCartStore()
  const { t } = useI18n()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 25)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const count = mounted ? totalCount() : 0
  const isHome = pathname === '/'

  // Appearance based on page & scroll:
  const isDarkCanvas = isHome && !scrolled

  const navContainerClass = isDarkCanvas
    ? 'bg-[#0a0d0f]/80 backdrop-blur-md border-white/10 text-[#ffffff]'
    : 'bg-[#ffffff]/95 backdrop-blur-md border-[#d5d6d7] text-[#0a0d0f] shadow-xs'

  const wordmarkColor = isDarkCanvas ? 'text-[#ffffff]' : 'text-[#0a0d0f]'
  const linkBaseColor = isDarkCanvas ? 'text-white/80 hover:text-[#1dd8e1]' : 'text-[#2e3438] hover:text-[#0a0d0f]'
  const iconBaseColor = isDarkCanvas ? 'text-[#ffffff] hover:text-[#1dd8e1]' : 'text-[#0a0d0f] hover:text-[#1dd8e1]'

  const isCatalogActive = pathname.startsWith('/catalog')
  const isConfiguratorActive = pathname.startsWith('/configurator') || pathname.startsWith('/personalizar')
  const isAboutActive = pathname.startsWith('/about')

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-16 border-b transition-colors duration-250 ${navContainerClass}`}
      >
        <div className="container-blok h-full px-4 sm:px-6 lg:px-8">
          {/* 
            SYMMETRICAL 3-ZONE CSS GRID LAYOUT:
            [1fr] [auto] [1fr]
            - Left: Aligned to start (commercial navigation)
            - Center: Mathematical center with dedicated luxury buffer padding
            - Right: Aligned to end (editorial/contact, language switcher, bag)
            This guarantees zero overlap, ample spacing, and perfect horizontal centering.
          */}
          <div
            className="h-full items-center"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
            }}
          >
            {/* ── ZONE 1: LEFT AREA (Menu toggle & Core Navigation) ── */}
            <div className="flex items-center gap-4 lg:gap-6 justify-self-start min-w-0">
              {/* Mobile / Tablet Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`p-1.5 -ml-1 transition-colors focus:outline-none shrink-0 ${iconBaseColor} xl:hidden`}
                aria-label={mobileOpen ? t.nav.close : t.nav.navigation}
                aria-expanded={mobileOpen}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {/* Desktop Core Commercial Links */}
              <nav className="hidden lg:flex items-center gap-5 xl:gap-7 shrink-0">
                <Link
                  href="/"
                  className={`font-cabin text-[11px] uppercase tracking-[0.14em] font-semibold transition-all whitespace-nowrap ${
                    pathname === '/'
                      ? 'text-[#1dd8e1] border-b-2 border-[#1dd8e1] pb-0.5'
                      : linkBaseColor
                  }`}
                >
                  {t.nav.home}
                </Link>

                <Link
                  href="/catalog"
                  className={`font-cabin text-[11px] uppercase tracking-[0.14em] font-semibold transition-all whitespace-nowrap ${
                    isCatalogActive
                      ? 'text-[#1dd8e1] border-b-2 border-[#1dd8e1] pb-0.5'
                      : linkBaseColor
                  }`}
                >
                  {t.nav.watches}
                </Link>

                <Link
                  href="/configurator"
                  className={`font-cabin text-[11px] uppercase tracking-[0.14em] font-semibold transition-all whitespace-nowrap ${
                    isConfiguratorActive
                      ? 'text-[#1dd8e1] border-b-2 border-[#1dd8e1] pb-0.5'
                      : linkBaseColor
                  }`}
                >
                  {t.nav.custom}
                </Link>
              </nav>
            </div>

            {/* ── ZONE 2: CENTER AREA (Brand Wordmark / Logo) ── */}
            <div className="justify-self-center text-center px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 shrink-0">
              <Link
                href="/"
                className={`inline-block font-jost font-bold text-[14px] xs:text-[16px] sm:text-[18px] md:text-[19px] tracking-[0.16em] sm:tracking-[0.20em] uppercase transition-colors truncate leading-none py-1 ${wordmarkColor}`}
              >
                Jairo Relojería
              </Link>
            </div>

            {/* ── ZONE 3: RIGHT AREA (Secondary Editorial, Language & Actions) ── */}
            <div className="flex items-center justify-end gap-3 sm:gap-4 lg:gap-6 justify-self-end min-w-0 shrink-0">
              {/* Atelier & Contact Link (Visible on xl+ screens with ample space) */}
              <Link
                href="/about"
                className={`hidden xl:inline-block font-cabin text-[11px] uppercase tracking-[0.14em] font-semibold transition-all whitespace-nowrap ${
                  isAboutActive
                    ? 'text-[#1dd8e1] border-b-2 border-[#1dd8e1] pb-0.5'
                    : linkBaseColor
                }`}
              >
                {t.nav.atelierAndContact}
              </Link>

              {/* Language Switcher (ES | EN) */}
              <div className="shrink-0">
                <LanguageSwitcher isDarkCanvas={isDarkCanvas} />
              </div>

              {/* Official Instagram Icon */}
              <a
                href="https://www.instagram.com/jairorelojeria/"
                target="_blank"
                rel="noopener noreferrer"
                className={`hidden sm:inline-flex p-1.5 transition-colors shrink-0 ${iconBaseColor}`}
                title="Instagram Oficial @jairorelojeria"
                aria-label="Instagram oficial @jairorelojeria"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* Shopping Bag Button with Real Count Indicator */}
              <button
                type="button"
                onClick={toggleCart}
                className={`relative p-1.5 transition-colors shrink-0 focus:outline-none ${iconBaseColor}`}
                aria-label={t.nav.bag}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1dd8e1] text-[#0a0d0f] font-cabin font-bold text-[9px] rounded-full flex items-center justify-center leading-none shadow-xs">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── RESPONSIVE MOBILE / TABLET DRAWER ── */}
        {mobileOpen && (
          <div className="absolute top-16 left-0 right-0 bg-[#0a0d0f] text-[#ffffff] border-b border-white/10 px-6 sm:px-8 py-7 space-y-6 shadow-2xl transition-all duration-250 animate-hero-fade">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-cabin text-[10px] uppercase tracking-[0.16em] text-[#1dd8e1] font-semibold">
                {t.nav.navigation}
              </span>
              <div className="flex items-center gap-4">
                <LanguageSwitcher isDarkCanvas={true} />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="font-cabin text-[10px] uppercase tracking-wider text-white/50 hover:text-white"
                >
                  {t.nav.close} ✕
                </button>
              </div>
            </div>

            <nav className="flex flex-col space-y-3.5">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="font-jost text-xl uppercase tracking-[0.12em] text-[#ffffff] hover:text-[#1dd8e1] transition-colors py-1.5 border-b border-white/5"
              >
                {t.nav.home}
              </Link>
              <Link
                href="/catalog"
                onClick={() => setMobileOpen(false)}
                className="font-jost text-xl uppercase tracking-[0.12em] text-[#ffffff] hover:text-[#1dd8e1] transition-colors py-1.5 border-b border-white/5"
              >
                {t.nav.watches}
              </Link>
              <Link
                href="/configurator"
                onClick={() => setMobileOpen(false)}
                className="font-jost text-xl uppercase tracking-[0.12em] text-[#ffffff] hover:text-[#1dd8e1] transition-colors py-1.5 border-b border-white/5"
              >
                {t.nav.custom}
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="font-jost text-xl uppercase tracking-[0.12em] text-[#ffffff] hover:text-[#1dd8e1] transition-colors py-1.5 border-b border-white/5"
              >
                {t.nav.atelierAndContact}
              </Link>
            </nav>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="/configurator"
                onClick={() => setMobileOpen(false)}
                className="btn-teal text-center py-3.5 text-[11px]"
              >
                {t.nav.customizeMyWatch}
              </Link>
              <Link
                href="/catalog"
                onClick={() => setMobileOpen(false)}
                className="btn-outline-light text-center py-3.5 text-[11px]"
              >
                {t.nav.viewWatches}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer Component */}
      <CartDrawer />
    </>
  )
}
