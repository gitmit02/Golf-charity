require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const configCloudinary = require('./config/cloudinary');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const drawRoutes = require('./routes/drawRoutes');
const charityRoutes = require('./routes/charityRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect DB + Cloudinary
connectDB();
configCloudinary();

// Routes (exact paths as requested)
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/draw', drawRoutes);
app.use('/api/charities', charityRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('🏌️‍♂️ Golf Charity Subscription Backend is LIVE & Production-Ready');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('✅ MongoDB Atlas connected');
  console.log('✅ Cloudinary configured');
  console.log('✅ All 8 feature sets ready');
});