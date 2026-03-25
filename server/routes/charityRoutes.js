const express = require('express');
const router = express.Router();
const { getCharities, createCharity } = require('../controllers/charityController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', getCharities);
router.post('/', authMiddleware, adminMiddleware, createCharity);

module.exports = router;