const router = require('express').Router();
const protect = require('../middleware/auth');
const Session = require('../models/Session');
const Request = require('../models/Request');
const User = require('../models/User');

// GET /api/sessions/:id
router.get('/:id', protect, async (req, res) => {
  const session = await Session.findById(req.params.id)
    .populate('teacher', 'name rating')
    .populate('learner', 'name')
    .populate('requestId', 'topic description');
  if (!session) return res.status(404).json({ message: 'Not found' });
  res.json(session);
});

// POST /api/sessions/:id/outcome
router.post('/:id/outcome', protect, async (req, res) => {
  const { outcome } = req.body;  // 'got_it' | 'didnt_get_it'
  const session = await Session.findById(req.params.id);
  if (!session) return res.status(404).json({ message: 'Not found' });

  session.outcome = outcome;
  session.endedAt = new Date();
  await session.save();

  await Request.findByIdAndUpdate(session.requestId, { status: 'done' });
  await User.findByIdAndUpdate(session.teacher, { $inc: { sessionsCount: 1 } });

  res.json({ message: 'Session closed', outcome });
});

module.exports = router;
