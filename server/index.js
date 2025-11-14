import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import propertyRoutes from './routes/properties.js';
import transactionRoutes from './routes/transactions.js';
import agentRoutes from './routes/agents.js';
import cityRoutes from './routes/cities.js';
import carRoutes from './routes/cars.js';
import storeRoutes from './routes/stores.js';
import datingRoutes from './routes/dating.js';
import petRoutes from './routes/pets.js';
import inventoryRoutes from './routes/inventory.js';
import cryptoRoutes from './routes/crypto.js';
import chatRoutes from './routes/chat.js';
import friendsRoutes from './routes/friends.js';
import notificationsRoutes from './routes/notifications.js';
import questsRoutes from './routes/quests.js';
import achievementsRoutes from './routes/achievements.js';
import settingsRoutes from './routes/settings.js';
import groupsRoutes from './routes/groups.js';
import eventsRoutes from './routes/events.js';
import marketplaceRoutes from './routes/marketplace.js';
import gamesRoutes from './routes/games.js';
import leaderboardsRoutes from './routes/leaderboards.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meta-the-world', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/dating', datingRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/crypto', cryptoRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/quests', questsRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/leaderboards', leaderboardsRoutes);

// Socket.io for real-time world updates
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-world', (userId) => {
    socket.join('world');
    socket.userId = userId;
    socket.join(`user-${userId}`);
    
    // Update user online status
    User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() }).catch(console.error);
    
    io.to('world').emit('user-joined', { userId, socketId: socket.id });
  });

  socket.on('player-move', (data) => {
    socket.to('world').emit('player-moved', { ...data, socketId: socket.id });
  });

  socket.on('property-update', (data) => {
    io.to('world').emit('property-changed', data);
  });

  // Chat messages
  socket.on('chat-message', async (data) => {
    const { chatType, content, receiverId, groupId, position } = data;
    
    try {
      const Message = (await import('./models/Message.js')).default;
      const message = new Message({
        sender: socket.userId,
        receiver: receiverId || null,
        chatType: chatType || 'global',
        group: groupId || null,
        content,
        position: position || null
      });
      await message.save();
      await message.populate('sender', 'username avatar');

      if (chatType === 'private' && receiverId) {
        io.to(`user-${receiverId}`).emit('chat-message', message);
        socket.emit('chat-message', message);
      } else if (chatType === 'group' && groupId) {
        io.to(`group-${groupId}`).emit('chat-message', message);
      } else {
        io.to('world').emit('chat-message', message);
      }
    } catch (error) {
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('join-group', (groupId) => {
    socket.join(`group-${groupId}`);
  });

  socket.on('leave-group', (groupId) => {
    socket.leave(`group-${groupId}`);
  });

  socket.on('disconnect', async () => {
    if (socket.userId) {
      // Update user offline status
      User.findByIdAndUpdate(socket.userId, { isOnline: false, lastSeen: new Date() }).catch(console.error);
      io.to('world').emit('user-left', { socketId: socket.id, userId: socket.userId });
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
