'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { es, TranslationType } from './locales/es'
import { en } from './locales/en'

export type Language = 'es' | 'en'

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationType
}

const dictionaries: Record<Language, TranslationType> = { es, en }

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('jairo_language') as Language
    if (stored === 'es' || stored === 'en') {
      setLanguageState(stored)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('jairo_language', lang)
    }
  }

  const t = dictionaries[language]

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    // Fallback safe defaults if used outside provider
    return {
      language: 'es' as Language,
      setLanguage: () => {},
      t: es,
    }
  }
  return context
}
