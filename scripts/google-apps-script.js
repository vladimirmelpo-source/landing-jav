/**
 * Google Apps Script для сохранения email в Google Таблицу
 *
 * Установка:
 * 1. Открой таблицу: https://docs.google.com/spreadsheets/d/1YSULwU7IGEBvqKGv2da0-24WrI1F2Pb9vYGeV3dIDXs/
 * 2. Extensions → Apps Script
 * 3. Вставь этот код, заменив весь Code.gs
 * 4. В первой строке листа добавь заголовки: Дата | Время | Email (если ещё нет)
 * 5. Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Скопируй URL развёртывания в .env как VITE_GOOGLE_SHEETS_WEB_APP_URL
 */

function doPost(e) {
  try {
    const params = e.parameter
    const email = params.email ? String(params.email).trim() : ''

    if (!email) {
      return createJsonResponse(400, { ok: false, error: 'Email is required' })
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
    const now = new Date()

    const dateStr = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd')
    const timeStr = Utilities.formatDate(now, Session.getScriptTimeZone(), 'HH:mm:ss')

    const lastRow = sheet.getLastRow()
    if (lastRow === 0) {
      sheet.appendRow(['Дата', 'Время', 'Email'])
    }
    sheet.appendRow([dateStr, timeStr, email])

    return createJsonResponse(200, { ok: true })
  } catch (err) {
    return createJsonResponse(500, { ok: false, error: String(err) })
  }
}

function createJsonResponse(status, data) {
  const output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
  return output
}
