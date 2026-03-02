import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { LocaleCode, Translations } from './types'
import en from './translations/en.json'
import ru from './translations/ru.json'
import ja from './translations/ja.json'
import es from './translations/es.json'
import pt from './translations/pt.json'

const STORAGE_KEY_LOCALE = 'locale'

const TRANSLATIONS: Record<LocaleCode, Translations> = {
  en: en as Translations,
  ru: ru as Translations,
  ja: ja as Translations,
  es: es as Translations,
  pt: pt as Translations,
}

const getNested = (obj: Translations, path: string): string => {
  const parts = path.split('.')
  let current: unknown = obj
  for (const p of parts) {
    if (current == null || typeof current !== 'object') return path
    current = (current as Record<string, unknown>)[p]
  }
  return typeof current === 'string' ? current : path
}

type I18nContextValue = {
  locale: LocaleCode
  setLocale: (code: LocaleCode) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

const getStoredLocale = (): LocaleCode => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_LOCALE)
    if (stored === 'en' || stored === 'ru' || stored === 'ja' || stored === 'es' || stored === 'pt') {
      return stored
    }
  } catch {
    // ignore
  }
  return 'en'
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(() => {
    const code = getStoredLocale()
    if (typeof document !== 'undefined') document.documentElement.lang = code === 'en' ? 'en' : code
    return code
  })

  const setLocale = useCallback((code: LocaleCode) => {
    setLocaleState(code)
    try {
      localStorage.setItem(STORAGE_KEY_LOCALE, code)
      if (typeof document !== 'undefined') {
        document.documentElement.lang = code === 'en' ? 'en' : code
      }
    } catch {
      // ignore
    }
  }, [])

  const t = useCallback(
    (key: string) => getNested(TRANSLATIONS[locale], key),
    [locale]
  )

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
