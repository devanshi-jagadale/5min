require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/ratings',  require('./routes/ratings'));

require('./socket/handlers')(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
