/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE: string
  readonly VITE_GOOGLE_SHEETS_WEB_APP_URL: string
  /** Tour ID для JAVHD (например 581) — используется в запросе тарифов и join URL */
  readonly VITE_JAVHD_TOUR_ID: string
  /** Base64 NATS code для affiliate tracking — передаётся в API тарифов и join URL */
  readonly VITE_JAVHD_NATS_CODE: string
  /** URL API для получения billing options (NATS-формат). Пусто — fallback на хардкод */
  readonly VITE_JAVHD_BILLING_API: string
  /** Базовый URL join/signup страницы (если use_track=false) */
  readonly VITE_JAVHD_JOIN_BASE: string
  /** true — использовать /track/{nats} для атрибуции (рекомендуется). false — signup.php?nats= */
  readonly VITE_JAVHD_USE_TRACK: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
