import fs from 'fs';
import open from 'open';
import { join } from 'path';

const CONFIG_PATH = join(process.cwd(), 'google-config.json');

async function openSheet() {
    try {
        if (!fs.existsSync(CONFIG_PATH)) {
            console.error("Config file not found. Please follow GOOGLE_SHEETS_SETUP.md first.");
            return;
        }

        const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
        const id = config.spreadsheetId;

        if (!id || id === "YOUR_SPREADSHEET_ID_HERE") {
            console.error("\x1b[31m[ERROR]\x1b[0m Spreadsheet ID is missing in google-config.json");
            console.log("Please paste your Google Sheet ID into 'google-config.json' first.");
            return;
        }

        const url = `https://docs.google.com/spreadsheets/d/${id}`;
        console.log(`Opening Google Sheet: ${url}`);
        await open(url);
    } catch (error) {
        console.error("Error opening sheet:", error.message);
    }
}

openSheet();
