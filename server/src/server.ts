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

dotenv.config();
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Rate limiter (optional, prevents abuse)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
});
app.use(limiter);

// CORS for REST APIs
const allowedOrigins = [
  'https://chat-app-ten-beige-30.vercel.app',
  'http://localhost:3000', // your frontend in dev
  'http://localhost:5173', // optional, if using Vite
];

if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);

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
    origin: allowedOrigins, // use same origins as REST API
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('New socket connected:', socket.id);

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

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// Listen on port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
