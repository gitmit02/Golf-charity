const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  subscriptionStatus: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
  subscriptionType: { type: String, enum: ['monthly', 'yearly'] },
  scores: [{
    score: { type: Number, required: true, min: 1, max: 45 },
    date: { type: Date, default: Date.now }
  }],
  charity: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity' },
  winnings: { type: Number, default: 0 },
  winnerProofImage: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Limit scores to last 5 (handled in controller)
module.exports = mongoose.model('User', userSchema);
