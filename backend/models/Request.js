const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  askedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic:       { type: String, required: true },
  description: { type: String },
  tags:        [String],
  status:      { type: String, enum: ['open', 'matched', 'done'], default: 'open' },
  matchedWith: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  sessionId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Session', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
