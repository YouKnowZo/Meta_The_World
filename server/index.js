const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meta-world', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/agents', require('./routes/agents'));

// Socket.io for real-time interactions
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-world', (userId) => {
    socket.join('world');
    socket.userId = userId;
    io.to('world').emit('user-joined', { userId, socketId: socket.id });
  });

  socket.on('player-move', (data) => {
    socket.broadcast.to('world').emit('player-moved', {
      userId: socket.userId,
      position: data.position,
      rotation: data.rotation
    });
  });

  socket.on('property-view', (propertyId) => {
    socket.broadcast.emit('property-viewed', { propertyId, userId: socket.userId });
  });

  socket.on('disconnect', () => {
    io.to('world').emit('user-left', { userId: socket.userId, socketId: socket.id });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
