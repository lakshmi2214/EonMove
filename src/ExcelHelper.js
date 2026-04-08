import XLSX from 'xlsx';
import fs from 'fs';
import { join } from 'path';

import { homedir } from 'os';

const DESKTOP_PATH = join(homedir(), 'Desktop');
const EXCEL_FILE = join(process.cwd(), 'submissions.xlsx');
const BACKUP_FILE = join(process.cwd(), 'backup_submissions.json');
const FALLBACK_FILE = join(process.cwd(), 'submissions_LATEST_SYNC.xlsx');

export function saveToExcel(sheetName, data) {
    let workbook;

    // 1. Try to read main file or create new
    if (fs.existsSync(EXCEL_FILE)) {
        try {
            workbook = XLSX.readFile(EXCEL_FILE);
        } catch (error) {
            console.warn(`[LOCKED] Main Excel file is open. Using backup data for sync.`);
            // If main file is locked, we'll build the workbook from the JSON backup
        }
    }

    // 2. Always update the JSON backup first (Source of Truth)
    let backupData = [];
    if (fs.existsSync(BACKUP_FILE)) {
        try {
            const raw = fs.readFileSync(BACKUP_FILE, 'utf8');
            backupData = JSON.parse(raw);
        } catch (e) {
            console.error("Backup file corrupted", e);
        }
    }
    backupData.push({ sheet: sheetName, ...data });
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(backupData, null, 2));

    // 3. Prepare the updated workbook (with ALL data from backup)
    const newWorkbook = XLSX.utils.book_new();
    const sheets = {};
    backupData.forEach(record => {
        const { sheet, ...rest } = record;
        if (!sheets[sheet]) sheets[sheet] = [];
        sheets[sheet].push(rest);
    });
    for (const [name, sData] of Object.entries(sheets)) {
        XLSX.utils.book_append_sheet(newWorkbook, XLSX.utils.json_to_sheet(sData), name);
    }

    // 4. Try to save to main file
    try {
        XLSX.writeFile(newWorkbook, EXCEL_FILE);
        console.log(`\x1b[32m[EXCEL SUCCESS]\x1b[0m Updated ${EXCEL_FILE}`);
    } catch (error) {
        if (error.code === 'EBUSY') {
            // Main file is open, save to fallback
            try {
                XLSX.writeFile(newWorkbook, FALLBACK_FILE);
                console.log(`\x1b[33m[EXCEL BUSY]\x1b[0m Saved to "${FALLBACK_FILE}" (Close main file to sync)`);
            } catch (e2) {
                console.error("Failed to save fallback", e2.message);
            }
        } else {
            console.error(`[EXCEL ERROR]`, error.message);
        }
    }
}
