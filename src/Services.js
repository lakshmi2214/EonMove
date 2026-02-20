import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.render('services', { title: 'Our Services' });
});

export default router;
