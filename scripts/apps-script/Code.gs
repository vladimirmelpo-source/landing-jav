/**
 * Web app doPost handler - receives email and appends to active sheet.
 * Deploy as Web app: Execute as: Me, Who has access: Anyone
 */

const createJsonResponse = (statusCode, data) => {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
};

const doPost = (e) => {
  try {
    const email = e?.parameter?.email;

    if (!email || typeof email !== 'string') {
      return createJsonResponse(400, {
        success: false,
        error: 'Missing or invalid email parameter',
      });
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      return createJsonResponse(400, {
        success: false,
        error: 'Email cannot be empty',
      });
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const now = new Date();
    const dateStr = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    const timeStr = Utilities.formatDate(now, Session.getScriptTimeZone(), 'HH:mm:ss');

    sheet.appendRow([dateStr, timeStr, trimmedEmail]);

    return createJsonResponse(200, {
      success: true,
      message: 'Email recorded successfully',
    });
  } catch (err) {
    console.error(err);
    return createJsonResponse(500, {
      success: false,
      error: 'Internal server error',
    });
  }
};
