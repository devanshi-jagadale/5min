const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text:   String,
  ts:     { type: Date, default: Date.now },
});

const sessionSchema = new mongoose.Schema({
  requestId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Request' },
  teacher:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  learner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startedAt:     { type: Date, default: Date.now },
  endedAt:       { type: Date, default: null },
  timerDuration: { type: Number, default: 300 },  // 5 mins in seconds
  outcome:       { type: String, enum: ['got_it', 'didnt_get_it', null], default: null },
  messages:      [messageSchema],
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
