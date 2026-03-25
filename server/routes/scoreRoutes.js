const express = require('express');
const router = express.Router();
const { addScore, getScores } = require('../controllers/scoreController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, addScore);
router.get('/', authMiddleware, getScores);

module.exports = router;