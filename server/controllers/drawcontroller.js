const Draw = require('../models/Draw');
const User = require('../models/User');

const runDraw = async (req, res) => {
  try {
    // Generate 5 unique random numbers (1-45)
    const numbers = [];
    while (numbers.length < 5) {
      const num = Math.floor(Math.random() * 45) + 1;
      if (!numbers.includes(num)) numbers.push(num);
    }
    numbers.sort((a, b) => a - b);

    // Get all active subscribers with at least one score
    const users = await User.find({
      subscriptionStatus: 'active',
      'scores.0': { $exists: true }
    });

    const winners = [];

    for (const user of users) {
      const userScores = user.scores.map(s => s.score);
      let matchCount = 0;

      for (const drawNum of numbers) {
        if (userScores.includes(drawNum)) matchCount++;
      }

      let matchType = null;
      let prize = 0;

      if (matchCount === 5) {
        matchType = '5 match';
        prize = 10000;
      } else if (matchCount === 4) {
        matchType = '4 match';
        prize = 2500;
      } else if (matchCount === 3) {
        matchType = '3 match';
        prize = 500;
      }

      if (matchType) {
        winners.push({
          userId: user._id,
          matchType,
          prize
        });

        // Update user winnings
        user.winnings += prize;
        await user.save();
      }
    }

    // Save draw
    const draw = new Draw({
      numbers,
      winners,
      date: Date.now()
    });

    await draw.save();

    // Populate winners for response
    await draw.populate('winners.userId', 'name email');

    res.json({
      success: true,
      message: 'Draw executed successfully',
      draw: {
        numbers: draw.numbers,
        winners: draw.winners,
        date: draw.date
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getLatestDraw = async (req, res) => {
  try {
    const latestDraw = await Draw.findOne()
      .sort({ date: -1 })
      .populate('winners.userId', 'name email');

    if (!latestDraw) {
      return res.status(404).json({ success: false, message: 'No draws found yet' });
    }

    res.json({ success: true, draw: latestDraw });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getDrawMeta = async (req, res) => {
  try {
    const latestDraw = await Draw.findOne().sort({ date: -1 }).select('date');
    const now = new Date();
    let nextDrawDate;

    if (latestDraw?.date) {
      nextDrawDate = new Date(latestDraw.date);
      nextDrawDate.setMonth(nextDrawDate.getMonth() + 1);
    } else {
      nextDrawDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    const msPerDay = 1000 * 60 * 60 * 24;
    const daysToDraw = Math.max(0, Math.ceil((nextDrawDate.getTime() - now.getTime()) / msPerDay));

    return res.json({
      success: true,
      meta: {
        latestDrawDate: latestDraw?.date || null,
        nextDrawDate,
        daysToDraw,
        monthlyPot: 10000,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { runDraw, getLatestDraw, getDrawMeta };
