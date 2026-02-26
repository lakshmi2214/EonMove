import express from 'express';
import { saveToExcel } from './ExcelHelper.js';
import { saveToGoogleSheets } from './GoogleSheetsHelper.js';

const router = express.Router();

router.use((req, res, next) => {
    console.log(`\x1b[36m[API]\x1b[0m ${req.method} ${req.url} from ${req.ip}`);
    next();
});

// Enquiry Form Submission
router.post('/submit-enquiry', async (req, res) => {
    try {
        const { name, phone, email, organisation, message } = req.body;

        const data = {
            Name: name,
            Phone: phone,
            Email: email,
            Organisation: organisation,
            Message: message,
            Date: new Date().toLocaleString()
        };

        // 1. Try Google Sheets
        const googleSuccess = await saveToGoogleSheets('Enquiry Form', data);

        // 2. Always Save to Local Excel/Backup (Redundancy)
        saveToExcel('Enquiry Form', data);

        res.json({
            success: true,
            message: googleSuccess ? 'Enquiry saved to Google Sheets!' : 'Enquiry saved locally!'
        });
    } catch (error) {
        console.error('Error saving enquiry:', error.message);
        res.status(500).json({
            success: false,
            message: error.code === 'EBUSY' ? error.message : 'Internal Server Error'
        });
    }
});

// Partnership Form (Contact Form) Submission
router.post('/submit-contact', async (req, res) => {
    try {
        const { name, phone, email, inquiry_type, state, city, found_us } = req.body;

        const data = {
            Name: name,
            Phone: phone,
            Email: email,
            Type: inquiry_type,
            State: state,
            City: city,
            Found_Us: found_us,
            Date: new Date().toLocaleString()
        };

        // 1. Try Google Sheets
        const googleSuccess = await saveToGoogleSheets('Partnership Form', data);

        // 2. Always Save to Local Excel/Backup (Redundancy)
        saveToExcel('Partnership Form', data);

        res.json({
            success: true,
            message: googleSuccess ? 'Partnership enquiry saved to Google Sheets!' : 'Partnership enquiry saved locally!'
        });
    } catch (error) {
        console.error('Error saving partnership enquiry:', error.message);
        res.status(500).json({
            success: false,
            message: error.code === 'EBUSY' ? error.message : 'Internal Server Error'
        });
    }
});

export default router;
