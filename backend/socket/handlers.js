const Session = require('../models/Session');

// track active timers per session
const timers = {};

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // user joins a session room
    socket.on('join-session', ({ sessionId, userId }) => {
      socket.join(sessionId);
      socket.to(sessionId).emit('peer-joined', { userId });

      // start 5-min countdown (only start once — check if timer already running)
      if (!timers[sessionId]) {
        let remaining = 300;
        timers[sessionId] = setInterval(async () => {
          remaining--;
          io.to(sessionId).emit('tick', { remaining });
          if (remaining <= 0) {
            clearInterval(timers[sessionId]);
            delete timers[sessionId];
            io.to(sessionId).emit('timer-end');
          }
        }, 1000);
      }
    });

    // chat message
    socket.on('send-message', async ({ sessionId, sender, text }) => {
      const msg = { sender, text, ts: new Date() };
      io.to(sessionId).emit('receive-message', msg);

      // persist to DB
      await Session.findByIdAndUpdate(sessionId, { $push: { messages: msg } });
    });

    // manual end session
    socket.on('end-session', ({ sessionId }) => {
      if (timers[sessionId]) {
        clearInterval(timers[sessionId]);
        delete timers[sessionId];
      }
      io.to(sessionId).emit('timer-end');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
};
