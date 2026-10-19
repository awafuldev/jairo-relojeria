'use client'

import { useEffect, useCallback } from 'react'
import { useConfiguratorStore } from '@/lib/store'
import { useI18n } from '@/lib/i18n/context'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import WatchViewer from './WatchViewer'
import StepNav from './StepNav'
import PieceGrid from './PieceGrid'
import ConfiguratorSummary from './ConfiguratorSummary'
import Link from 'next/link'

export default function Configurator() {
  const { t } = useI18n()
  const {
    categories,
    currentStepIndex,
    setCategories,
    setAvailablePieces,
    setLoadingPieces,
    setAllRules,
    totalPrice,
  } = useConfiguratorStore()

  // Load categories and all compatibility rules once on mount
  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/compatibility').then(r => r.json()),
    ]).then(([cats, rules]) => {
      setCategories(cats || [])
      setAllRules(rules || [])
    }).catch(console.error)
  }, [setCategories, setAllRules])

  const currentCategory = categories[currentStepIndex]
  const isOnSummary = currentStepIndex >= categories.length

  // Load pieces for the active category
  const loadPieces = useCallback(async () => {
    if (!currentCategory) return
    setLoadingPieces(true)
    try {
      const res = await fetch(`/api/categories/${currentCategory.slug}/pieces`)
      const data = await res.json()
      setAvailablePieces(data.pieces || [])
    } catch (err) {
      console.error(err)
      setAvailablePieces([])
    }
  }, [currentCategory, setAvailablePieces, setLoadingPieces])

  useEffect(() => {
    if (!isOnSummary) {
      loadPieces()
    }
  }, [loadPieces, isOnSummary, currentStepIndex])

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col font-poppins">
      {/* ── TOP HEADER (Blok Style) ── */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#ffffff]/95 backdrop-blur-md border-b border-[#d5d6d7] h-16">
        <div className="container-blok flex items-center justify-between h-full">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-jost font-bold text-[14px] md:text-[16px] tracking-[0.16em] uppercase text-[#0a0d0f] hover:opacity-85 transition-opacity"
            >
              Jairo Relojería
            </Link>
            <span className="hidden sm:inline-block w-px h-4 bg-[#d5d6d7]" />
            <span className="hidden sm:inline-block font-cabin text-[10px] uppercase tracking-[0.14em] text-[#2e3438]">
              {t.configurator.headerTitle}
            </span>
          </div>

          {/* Right: Live Investment & Catalog Link & Language Switcher */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="text-right">
              <span className="font-cabin text-[9px] uppercase tracking-[0.12em] text-[#2e3438] block leading-none">
                {t.configurator.estimatedInvestment}
              </span>
              <span className="font-poppins text-[15px] font-semibold tabular-nums text-[#0a0d0f] leading-tight">
                ${totalPrice.toFixed(0)}{' '}
                <span className="font-cabin text-[10px] text-[#1dd8e1] font-bold">USD</span>
              </span>
            </div>
            <Link
              href="/catalog"
              className="hidden md:inline-flex items-center justify-center px-3.5 py-1.5 border border-[#d5d6d7] text-[#0a0d0f] hover:bg-[#f7f7f7] font-cabin text-[10px] uppercase tracking-[0.12em] rounded-[3px] transition-colors"
            >
              {t.configurator.viewCatalog}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* ── MAIN WORKSPACE ── */}
      <main className="flex-1 pt-16 flex flex-col">
        {isOnSummary ? (
          <div className="flex-1 overflow-y-auto">
            <ConfiguratorSummary />
          </div>
        ) : (
          <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
            {/* 1. LEFT COLUMN: Step Sidebar (Desktop) */}
            <aside className="hidden lg:flex flex-col w-60 border-r border-[#d5d6d7] pt-5 pb-4 shrink-0 bg-[#ffffff]">
              <StepNav />
            </aside>

            {/* 2. CENTER COLUMN: Watch Visualizer Canvas (Sticky & Dominant) */}
            <section className="w-full lg:w-[480px] xl:w-[520px] h-[340px] sm:h-[400px] lg:h-full shrink-0 border-b lg:border-b-0 lg:border-r border-[#d5d6d7]">
              <WatchViewer />
            </section>

            {/* 3. RIGHT COLUMN: Visual Piece Selection Catalog */}
            <section className="flex-1 overflow-y-auto bg-[#ffffff] p-5 sm:p-7 xl:p-9">
              {/* Mobile Category Navigation Pills */}
              <div className="lg:hidden mb-5">
                <StepNav mobile />
              </div>

              {currentCategory && (
                <>
                  <div className="mb-6 pb-4 border-b border-[#f7f7f7]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-cabin text-[10px] uppercase tracking-[0.14em] text-[#1dd8e1] font-semibold">
                        Paso {String(currentStepIndex + 1).padStart(2, '0')} de {categories.length}
                      </span>
                      {currentCategory.isRequired ? (
                        <span className="font-cabin text-[9px] uppercase tracking-wider text-[#0a0d0f] bg-[#f7f7f7] border border-[#d5d6d7] px-1.5 py-0.5 rounded-[2px]">
                          Requerido
                        </span>
                      ) : (
                        <span className="font-cabin text-[9px] uppercase tracking-wider text-[#2e3438] bg-[#f7f7f7] px-1.5 py-0.5 rounded-[2px]">
                          Opcional
                        </span>
                      )}
                    </div>
                    <h1 className="editorial-title text-2xl sm:text-3xl text-[#0a0d0f] tracking-[0.08em]">
                      {currentCategory.name}
                    </h1>
                    {currentCategory.description && (
                      <p className="text-[13px] text-[#2e3438] font-poppins mt-1.5 max-w-xl leading-relaxed">
                        {currentCategory.description}
                      </p>
                    )}
                  </div>

                  <PieceGrid />
                </>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
