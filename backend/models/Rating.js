const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  sessionId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
  ratedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ratedUser:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score:      { type: Number, min: 1, max: 5 },
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);
