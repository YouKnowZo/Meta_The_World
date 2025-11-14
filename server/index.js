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
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const agentRoutes = require('./routes/agents');
const transactionRoutes = require('./routes/transactions');

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/transactions', transactionRoutes);

// Socket.io for real-time world interactions
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-world', (userId) => {
    socket.join('world');
    socket.userId = userId;
    io.to('world').emit('user-joined', { userId, socketId: socket.id });
  });

  socket.on('update-position', (data) => {
    socket.broadcast.to('world').emit('user-moved', {
      userId: socket.userId,
      position: data.position,
      rotation: data.rotation
    });
  });

  socket.on('disconnect', () => {
    io.to('world').emit('user-left', { userId: socket.userId, socketId: socket.id });
  });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meta-the-world', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch(err => console.error('MongoDB connection error:', err));
