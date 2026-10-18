'use client'

import React from 'react'
import { useI18n, Language } from '@/lib/i18n/context'

interface LanguageSwitcherProps {
  isDarkCanvas?: boolean
  className?: string
}

export default function LanguageSwitcher({ isDarkCanvas = false, className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useI18n()

  const handleToggle = (lang: Language) => {
    if (language !== lang) {
      setLanguage(lang)
    }
  }

  const activeColor = '#1dd8e1' // Signal Teal
  const inactiveColor = isDarkCanvas ? 'text-white/60 hover:text-white' : 'text-[#686c6d] hover:text-[#0a0d0f]'
  const dividerColor = isDarkCanvas ? 'text-white/20' : 'text-[#d5d6d7]'

  return (
    <div
      className={`inline-flex items-center gap-1 font-cabin text-[10px] uppercase font-bold tracking-[0.14em] select-none ${className}`}
      aria-label="Selector de idioma / Language selector"
    >
      <button
        type="button"
        onClick={() => handleToggle('es')}
        className={`px-1 py-0.5 transition-colors focus:outline-none rounded-[2px] ${
          language === 'es' ? 'font-bold' : inactiveColor
        }`}
        style={language === 'es' ? { color: activeColor } : {}}
      >
        ES
      </button>
      <span className={dividerColor}>|</span>
      <button
        type="button"
        onClick={() => handleToggle('en')}
        className={`px-1 py-0.5 transition-colors focus:outline-none rounded-[2px] ${
          language === 'en' ? 'font-bold' : inactiveColor
        }`}
        style={language === 'en' ? { color: activeColor } : {}}
      >
        EN
      </button>
    </div>
  )
}
