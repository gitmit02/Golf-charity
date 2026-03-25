const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  numbers: [{ type: Number, min: 1, max: 45 }],
  winners: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    matchType: { type: String, enum: ['5 match', '4 match', '3 match'] },
    prize: { type: Number }
  }],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Draw', drawSchema);