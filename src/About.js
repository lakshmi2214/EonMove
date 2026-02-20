import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.render('about', { title: 'About Us' });
});

export default router;
