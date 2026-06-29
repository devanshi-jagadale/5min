const router = require('express').Router();
const protect = require('../middleware/auth');
const Rating = require('../models/Rating');
const User = require('../models/User');

// POST /api/ratings
router.post('/', protect, async (req, res) => {
  const { sessionId, ratedUser, score } = req.body;
  const rating = await Rating.create({ sessionId, ratedBy: req.user.id, ratedUser, score });

  // recompute average rating
  const all = await Rating.find({ ratedUser });
  const avg = all.reduce((s, r) => s + r.score, 0) / all.length;
  await User.findByIdAndUpdate(ratedUser, { rating: Math.round(avg * 10) / 10 });

  res.status(201).json(rating);
});

module.exports = router;

