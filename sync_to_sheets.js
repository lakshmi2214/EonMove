import { saveToGoogleSheets } from './src/GoogleSheetsHelper.js';
import fs from 'fs';
import { join } from 'path';

const BACKUP_FILE = join(process.cwd(), 'backup_submissions.json');

async function syncAll() {
    console.log("Starting full sync to Google Sheets...");

    if (!fs.existsSync(BACKUP_FILE)) {
        console.error("No backup file found to sync.");
        return;
    }

    const submissions = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8'));
    console.log(`Found ${submissions.length} submissions in backup.`);

    let successCount = 0;
    for (const record of submissions) {
        const { sheet, ...data } = record;
        console.log(`Syncing: ${record.Name} to ${sheet}...`);
        const success = await saveToGoogleSheets(sheet, data);
        if (success) successCount++;
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`\nSync Complete!`);
    console.log(`Successfully synced: ${successCount} / ${submissions.length}`);
}

syncAll();
