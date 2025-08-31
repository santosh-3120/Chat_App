import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import chatRoutes from './routes/chatRoutes';
import messageRoutes from './routes/messageRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';
import { createClient } from 'redis';
import User from './models/userModel';

dotenv.config();
connectDB();

const app = express();

// Redis setup
const redisClient = createClient({
  url: process.env.REDIS_URL,
});
redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.connect();

// Body parser
app.use(express.json());

// Rate limiter
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// CORS
const allowedOrigins = [
  'https://chat-app-ten-beige-30.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Routes
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('New socket connected:', socket.id);

  socket.on('setup', async (user: any) => {
    if (user?._id) {
      await redisClient.set(`user:${user._id}`, socket.id);
      await User.findByIdAndUpdate(user._id, {
        socketId: socket.id,
        lastSeen: new Date(),
      });
      socket.emit('connected');
      // Broadcast presence
      const users = await User.find({ _id: { $ne: user._id } }).select('name email socketId lastSeen').lean();
      const onlineUsers = await Promise.all(
        users.map(async (u) => ({
          ...u,
          isOnline: (await redisClient.get(`user:${u._id}`)) !== null,
        }))
      );
      io.emit('presence update', onlineUsers);
    }
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (message) => {
    const chat = message.chat;
    if (!chat.users) return console.log('Chat.users not defined');
    chat.users.forEach((user: any) => {
      if (user._id === message.sender._id) return;
      socket.to(user._id).emit('message received', message);
    });
  });

  socket.on('disconnect', async () => {
    console.log('Socket disconnected:', socket.id);
    const user = await User.findOneAndUpdate(
      { socketId: socket.id },
      { socketId: null, lastSeen: new Date() },
      { new: true }
    ).lean();
    if (user) {
      await redisClient.del(`user:${user._id}`);
      const users = await User.find({ _id: { $ne: user._id } }).select('name email socketId lastSeen').lean();
      const onlineUsers = await Promise.all(
        users.map(async (u) => ({
          ...u,
          isOnline: (await redisClient.get(`user:${u._id}`)) !== null,
        }))
      );
      io.emit('presence update', onlineUsers);
    }
  });
});

// Listen on port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});