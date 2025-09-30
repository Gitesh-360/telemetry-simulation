require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/telemetrydb';
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: '*' }});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('Mongo connect error', err));

// Routes
const authRoutes = require('./routes/auth');
const robotRoutes = require('./routes/robots');
app.use('/api/auth', authRoutes);
app.use('/api/robots', robotRoutes);

// Socket.io JWT handshake
io.use((socket, next) => {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error: token missing'));
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return next(new Error('Authentication error: invalid token'));
        socket.user = decoded;
        next();
    });
});

io.on('connection', (socket) => {
    console.log('WS connected:', socket.id, 'user:', socket.user && socket.user.email);
    socket.on('subscribe', (room) => {
        socket.join(room);
    });
    socket.on('disconnect', () => {
        // handle disconnect
    });
});

// Start telemetry simulator
const Robot = require('./models/Robot');
const startSimulator = require('./telemetrySimulator');
startSimulator(io, Robot);

// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
