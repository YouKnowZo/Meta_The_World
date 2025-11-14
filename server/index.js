const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();

const db = require('./database');
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const transactionRoutes = require('./routes/transactions');
const agentRoutes = require('./routes/agents');
const userRoutes = require('./routes/users');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
db.init();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Meta The World API is running' });
});

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-world', (userId) => {
    socket.join('world');
    socket.userId = userId;
    io.to('world').emit('user-joined', { userId, socketId: socket.id });
  });

  socket.on('property-updated', (propertyId) => {
    socket.broadcast.to('world').emit('property-changed', propertyId);
  });

  socket.on('transaction-completed', (transaction) => {
    io.to('world').emit('new-transaction', transaction);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (socket.userId) {
      io.to('world').emit('user-left', { userId: socket.userId });
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Meta The World server running on port ${PORT}`);
});

module.exports = { app, io };
