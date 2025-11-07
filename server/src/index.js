import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import landRoutes from './routes/lands.js';
import marketplaceRoutes from './routes/marketplace.js';

dotenv.config({ path: '../.env' });

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lands', landRoutes);
app.use('/api/marketplace', marketplaceRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// MongoDB connection
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
} else {
  console.warn('MongoDB URI not provided, running without database');
}

// Socket.IO for multiplayer
const players = new Map();

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  // Initialize player
  players.set(socket.id, {
    id: socket.id,
    position: { x: 0, y: 5, z: 10 },
    rotation: { x: 0, y: 0, z: 0 },
    username: `Player_${socket.id.slice(0, 6)}`,
  });

  // Send existing players to new player
  socket.emit('playersInit', Array.from(players.values()));

  // Broadcast new player to others
  socket.broadcast.emit('playerJoined', players.get(socket.id));

  // Handle position updates
  socket.on('positionUpdate', (data) => {
    const player = players.get(socket.id);
    if (player) {
      player.position = data.position;
      player.rotation = data.rotation || player.rotation;

      // Broadcast to other players
      socket.broadcast.emit('playerUpdate', {
        id: socket.id,
        position: player.position,
        rotation: player.rotation,
      });
    }
  });

  // Handle chat messages
  socket.on('chatMessage', (message) => {
    io.emit('chatMessage', {
      id: socket.id,
      username: players.get(socket.id)?.username || 'Unknown',
      message,
      timestamp: Date.now(),
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    players.delete(socket.id);
    socket.broadcast.emit('playerDisconnected', socket.id);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready for multiplayer connections`);
});

export { io };
