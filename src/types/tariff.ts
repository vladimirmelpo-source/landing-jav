export interface TariffFeature {
  text: string
  included?: boolean
}

export interface Tariff {
  id: string
  name: string
  price: number
  currency?: string
  period?: string // e.g. "month", "year"
  features?: TariffFeature[]
  /** кнопка: текст и/или ссылка */
  ctaText?: string
  ctaUrl?: string
  highlighted?: boolean
  /** Краткое название для строки: "Trial", "1 month", "12 months", "Lifetime" */
  displayName?: string
  /** Цена за день для отображения: "$0.69/day" */
  dayPrice?: string
  /** Бейджи: синий (offer) — Limited offer, +3 free months; красный (discount) — -50% off */
  badges?: { text: string; type: 'offer' | 'discount' }[]
  [key: string]: unknown
}

export interface TariffsResponse {
  items: Tariff[]
}

/** Элемент тарифа из ответа сервера (формат API) */
export interface ServerTariffItem {
  name: string
  initial: string
  initial_nice?: string
  initial_days: string
  rebill?: string
  rebill_nice?: string
  rebill_days?: string
  packageid?: string
  optionid: string | number
  is_trial?: boolean
  month_price?: number
  day_price?: string
  price?: number | string
  month_count?: number
  base_price?: string
  day_base_price?: string
  month_price_pcnt?: number
  month_price_discount?: number
  [key: string]: unknown
}

export interface ServerTariffsResponse {
  success: boolean
  data: {
    items: ServerTariffItem[]
    cascade?: number
  }
}
