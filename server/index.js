import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
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

// Socket.io for real-time world updates
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-world', (userId) => {
    socket.join('world');
    socket.userId = userId;
    io.to('world').emit('user-joined', { userId, socketId: socket.id });
  });

  socket.on('player-move', (data) => {
    socket.to('world').emit('player-moved', { ...data, socketId: socket.id });
  });

  socket.on('property-update', (data) => {
    io.to('world').emit('property-changed', data);
  });

  socket.on('disconnect', () => {
    io.to('world').emit('user-left', { socketId: socket.id });
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
