import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import chatRoutes from './routes/chatRoutes';
import messageRoutes from './routes/messageRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// Rate limiting for security
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
});
app.use(limiter);

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('User connected up:', socket.id);

  socket.on('setup', (userData: { _id: string }) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room: string) => {
    socket.join(room);
    console.log('User joined room:', room);
  });

  socket.on('typing', (room: string) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room: string) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMessage: any) => {
    const chat = newMessage.chat;
    if (!chat.users) return console.log('chat.users not defined');

    chat.users.forEach((u: any) => {
      if (u._id === newMessage.sender._id) return;
      socket.in(u._id).emit('message received', newMessage);
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running onnn port ${PORT}`));