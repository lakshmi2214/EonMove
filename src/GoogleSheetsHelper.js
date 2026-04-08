import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import { join } from 'path';

// This is where you will put your Google credentials
const CREDENTIALS_PATH = join(process.cwd(), 'google-credentials.json');
const CONFIG_PATH = join(process.cwd(), 'google-config.json');

export async function saveToGoogleSheets(sheetName, data) {
    try {
        // 1. Check if setup exists
        if (!fs.existsSync(CREDENTIALS_PATH) || !fs.existsSync(CONFIG_PATH)) {
            console.warn("[GOOGLE SHEETS] Setup missing. Skipping Google Sheets sync.");
            return false;
        }

        const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
        const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

        if (!config.spreadsheetId) {
            console.warn("[GOOGLE SHEETS] Spreadsheet ID missing.");
            return false;
        }

        // 2. Initialize Auth
        const serviceAccountAuth = new JWT({
            email: credentials.client_email,
            key: credentials.private_key,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(config.spreadsheetId, serviceAccountAuth);
        console.log(`[GOOGLE SHEETS] Attempting to access sheet ${config.spreadsheetId} with account: ${credentials.client_email}`);

        // 3. Load Document
        await doc.loadInfo();
        console.log(`[GOOGLE SHEETS] Loaded doc: ${doc.title}`);

        // 4. Get or Create Sheet
        let sheet = doc.sheetsByTitle[sheetName];
        if (!sheet) {
            console.log(`[GOOGLE SHEETS] Creating new sheet: ${sheetName}`);
            sheet = await doc.addSheet({ title: sheetName, headerValues: Object.keys(data) });
        }

        // 5. Append Row
        await sheet.addRow(data);
        console.log(`\x1b[32m[GOOGLE SHEETS SUCCESS]\x1b[0m Row added to "${sheetName}"`);
        return true;
    } catch (error) {
        console.error(`[GOOGLE SHEETS ERROR]`, error.message);
        return false;
    }
}
