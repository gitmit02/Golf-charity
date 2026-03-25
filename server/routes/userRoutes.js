const express = require('express');
const router = express.Router();
const multer = require('multer');

const { 
  getDashboard, 
  subscribe, 
  uploadProof,
  setCharity,
  getPublicStats,
  getAllUsers,
  getAdminWinners,
  getAnalytics 
} = require('../controllers/userController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage }).single('proofImage');

router.get('/dashboard', authMiddleware, getDashboard);
router.post('/subscription', authMiddleware, subscribe);
router.post('/upload-proof', authMiddleware, upload, uploadProof);
router.post('/charity', authMiddleware, setCharity);
router.get('/public-stats', getPublicStats);

// Admin only routes
router.get('/admin/users', authMiddleware, adminMiddleware, getAllUsers);
router.get('/admin/winners', authMiddleware, adminMiddleware, getAdminWinners);
router.get('/admin/analytics', authMiddleware, adminMiddleware, getAnalytics);

module.exports = router;
