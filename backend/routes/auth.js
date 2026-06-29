const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, skills } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already in use' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, skills });
  res.status(201).json({ token: genToken(user._id), user: { id: user._id, name, email, skills } });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ message: 'Invalid credentials' });

  res.json({ token: genToken(user._id), user: { id: user._id, name: user.name, email, skills: user.skills } });
});

module.exports = router;
