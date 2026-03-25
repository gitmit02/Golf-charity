const express = require('express');
const router = express.Router();
const { runDraw, getLatestDraw, getDrawMeta } = require('../controllers/drawcontroller');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/run', authMiddleware, adminMiddleware, runDraw);
router.get('/latest', getLatestDraw);   // Public or protected - you can add auth if needed
router.get('/meta', getDrawMeta);

module.exports = router;
