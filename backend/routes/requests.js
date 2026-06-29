const router = require('express').Router();
const protect = require('../middleware/auth');
const Request = require('../models/Request');
const Session = require('../models/Session');

// GET /api/requests — all open requests
router.get('/', protect, async (req, res) => {
  const requests = await Request.find({
    $or: [
      { status: 'open' },
      { askedBy: req.user.id }   // always show your own regardless of status
    ]
  })
    .populate('askedBy', 'name rating')
    .sort({ createdAt: -1 });
  res.json(requests);
});

// POST /api/requests — create a request
router.post('/', protect, async (req, res) => {
  const { topic, description, tags } = req.body;
  const request = await Request.create({ askedBy: req.user.id, topic, description, tags });
  res.status(201).json(request);
});

// POST /api/requests/:id/accept — volunteer to teach
router.post('/:id/accept', protect, async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (!request || request.status !== 'open')
    return res.status(400).json({ message: 'Request not available' });
  if (request.askedBy.toString() === req.user.id)
    return res.status(400).json({ message: 'Cannot accept your own request' });

  const session = await Session.create({
    requestId: request._id,
    teacher:   req.user.id,
    learner:   request.askedBy,
  });

  request.status      = 'matched';
  request.matchedWith = req.user.id;
  request.sessionId   = session._id;
  await request.save();

  res.json({ sessionId: session._id });
});

// DELETE /api/requests/:id
router.delete('/:id', protect, async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (!request) return res.status(404).json({ message: 'Not found' });
  if (request.askedBy.toString() !== req.user.id)
    return res.status(403).json({ message: 'Not authorized' });

  await request.deleteOne();
  res.json({ message: 'Deleted' });
});

module.exports = router;
