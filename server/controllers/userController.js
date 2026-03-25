const User = require('../models/User');
const Charity = require('../models/Charity');
const cloudinary = require('cloudinary').v2;

const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('charity', 'name description image');
    res.json({
      success: true,
      data: {
        subscriptionStatus: user.subscriptionStatus,
        subscriptionType: user.subscriptionType,
        scores: user.scores,
        charity: user.charity,
        winnings: user.winnings,
        winnerProofImage: user.winnerProofImage
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const subscribe = async (req, res) => {
  try {
    const { subscriptionType, charityId } = req.body;
    if (!['monthly', 'yearly'].includes(subscriptionType)) {
      return res.status(400).json({ success: false, message: 'Invalid subscription type' });
    }

    const updateData = { subscriptionStatus: 'active', subscriptionType };

    if (charityId) {
      const charityExists = await Charity.findById(charityId);
      if (!charityExists) return res.status(400).json({ success: false, message: 'Charity not found' });
      updateData.charity = charityId;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true })
      .populate('charity', 'name');

    res.json({ success: true, message: 'Subscription activated', user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const uploadProof = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No image uploaded' });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'golf-charity/winner-proofs' },
        (error, result) => error ? reject(error) : resolve(result)
      );
      stream.end(req.file.buffer);
    });

    await User.findByIdAndUpdate(req.user.id, { winnerProofImage: result.secure_url });

    res.json({ success: true, message: 'Winner proof uploaded', imageUrl: result.secure_url });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const setCharity = async (req, res) => {
  try {
    const { charityId } = req.body;
    if (!charityId) {
      return res.status(400).json({ success: false, message: 'Charity ID is required' });
    }

    const charity = await Charity.findById(charityId);
    if (!charity) {
      return res.status(404).json({ success: false, message: 'Charity not found' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { charity: charityId },
      { new: true }
    ).populate('charity', 'name description image');

    return res.json({ success: true, message: 'Charity preference saved', user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getPublicStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSubscribers = await User.countDocuments({ subscriptionStatus: 'active' });
    const charityCount = await Charity.countDocuments();

    const monthlySubscribers = await User.countDocuments({
      subscriptionStatus: 'active',
      subscriptionType: 'monthly',
    });
    const yearlySubscribers = await User.countDocuments({
      subscriptionStatus: 'active',
      subscriptionType: 'yearly',
    });

    const estimatedMonthlyRevenue = (monthlySubscribers * 9.99) + (yearlySubscribers * (89.99 / 12));
    const estimatedMonthlyDonation = estimatedMonthlyRevenue * 0.15;
    const estimatedTotalDonated = estimatedMonthlyDonation * 12;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalSubscribers,
        charityCount,
        estimatedMonthlyRevenue,
        estimatedMonthlyDonation,
        estimatedTotalDonated,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ADMIN DASHBOARD ENDPOINTS
const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password').populate('charity', 'name');
  res.json({ success: true, users });
};

const getAdminWinners = async (req, res) => {
  const winners = await User.find({ winnings: { $gt: 0 } })
    .select('name email winnings winnerProofImage')
    .populate('charity', 'name');
  res.json({ success: true, winners });
};

const getAnalytics = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalSubscribers = await User.countDocuments({ subscriptionStatus: 'active' });
  const totalCharityContribution = totalSubscribers * 50; // Simulated charity contribution ($50 per active subscription)

  res.json({
    success: true,
    analytics: {
      totalUsers,
      totalSubscribers,
      totalCharityContribution
    }
  });
};

module.exports = {
  getDashboard,
  subscribe,
  uploadProof,
  setCharity,
  getPublicStats,
  getAllUsers,
  getAdminWinners,
  getAnalytics
};
