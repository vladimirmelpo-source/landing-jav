const WEB_APP_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEB_APP_URL ?? ''

export type SubmitEmailResult =
  | { ok: true }
  | { ok: false; error: string }

/** Form-urlencoded для обхода CORS preflight (simple request). */
export const submitEmailToSheet = async (email: string): Promise<SubmitEmailResult> => {
  if (!WEB_APP_URL) {
    return { ok: false, error: 'Google Sheets Web App URL not configured' }
  }
  try {
    const body = new URLSearchParams({ email: email.trim() })
    const res = await fetch(WEB_APP_URL, {
      method: 'POST',
      body,
    })
    if (!res.ok) {
      const text = await res.text()
      return { ok: false, error: text || res.statusText }
    }
    return { ok: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false, error: msg }
  }
}
