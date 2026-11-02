import { google } from "googleapis";

type SheetCredentials = {
  clientEmail: string;
  privateKey: string;
};

function getCredentials(): SheetCredentials | null {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n",
  );

  if (!clientEmail || !privateKey) {
    return null;
  }

  return { clientEmail, privateKey };
}

export function isGoogleSheetsConfigured(): boolean {
  return getCredentials() !== null;
}

function sheetTabRange(tabName: string, columns = "A:AZ") {
  const quoted = /[\s'!]/.test(tabName) ? `'${tabName.replace(/'/g, "''")}'` : tabName;
  return `${quoted}!${columns}`;
}

export async function appendRowToSheet({
  sheetId,
  tabName,
  values,
  columns,
}: {
  sheetId: string;
  tabName: string;
  values: (string | number | boolean)[];
  /** Column span for append range, e.g. `A:J` for ContactUs. */
  columns?: string;
}) {
  const credentials = getCredentials();

  if (!credentials) {
    throw new Error(
      "Google Sheets is not configured. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.",
    );
  }

  const auth = new google.auth.JWT({
    email: credentials.clientEmail,
    key: credentials.privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: sheetTabRange(tabName, columns),
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [values],
    },
  });
}
