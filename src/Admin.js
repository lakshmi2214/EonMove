import express from 'express';
import fs from 'fs';
import { join } from 'path';
import XLSX from 'xlsx';

const router = express.Router();
const BACKUP_FILE = join(process.cwd(), 'backup_submissions.json');

// 1. View Dashboard (HTML Table)
router.get('/', (req, res) => {
    try {
        let submissions = [];
        if (fs.existsSync(BACKUP_FILE)) {
            submissions = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8'));
        }

        let spreadsheetId = null;
        const configPath = join(process.cwd(), 'google-config.json');
        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            spreadsheetId = config.spreadsheetId;
        }

        // Split into two categories
        const enquiries = submissions.filter(s => s.sheet === 'Enquiry Form').reverse();
        const partnerships = submissions.filter(s => s.sheet === 'Partnership Form').reverse();

        res.render('admin_dashboard', { enquiries, partnerships, spreadsheetId });
    } catch (error) {
        res.status(500).send("Error loading dashboard");
    }
});

// 2. Download Live Excel
router.get('/download', (req, res) => {
    try {
        if (!fs.existsSync(BACKUP_FILE)) return res.status(404).send("No data found");

        const data = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8'));
        const workbook = XLSX.utils.book_new();

        const sheets = {};
        data.forEach(record => {
            const { sheet, ...rest } = record;
            if (!sheets[sheet]) sheets[sheet] = [];
            sheets[sheet].push(rest);
        });

        for (const [name, sData] of Object.entries(sheets)) {
            XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(sData), name);
        }

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=EpnMove_Submissions_Live.xlsx');
        res.send(buffer);
    } catch (error) {
        res.status(500).send("Error generating Excel");
    }
});

export default router;
