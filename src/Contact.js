import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.render('contact', { title: 'Contact Us' });
});

router.post('/submit', (req, res) => {
    // Handle form submission
    res.json({ success: true, message: 'Message received!' });
});

export default router;
