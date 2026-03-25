const User = require('../models/User');

const addScore = async (req, res) => {
  try {
    const { score } = req.body;

    if (!score || score < 1 || score > 45) {
      return res.status(400).json({ 
        success: false, 
        message: 'Score must be between 1 and 45' 
      });
    }

    const user = await User.findById(req.user.id);

    // Add new score
    user.scores.unshift({
      score,
      date: Date.now()
    });

    // Keep only last 5 scores
    if (user.scores.length > 5) {
      user.scores = user.scores.slice(0, 5);
    }

    await user.save();

    res.json({
      success: true,
      message: 'Score added successfully',
      scores: user.scores
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getScores = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('scores');
    res.json({ success: true, scores: user.scores });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { addScore, getScores };