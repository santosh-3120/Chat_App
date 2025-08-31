import { AuthRequest } from '../types/AuthRequest';
import asyncHandler from 'express-async-handler';
import { Response } from 'express';
import Message, { IMessage } from '../models/messageModel';
import User from '../models/userModel';
import Chat from '../models/chatModel';
import mongoose from 'mongoose';

const sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  console.log("sendMessage called", req.body, req.user?._id); // log immediately

  const { content, chatId } = req.body;

  if (!content || !chatId || !req.user?._id) {
    console.log("Invalid request data or missing user"); // debug
    res.status(400).json({ message: 'Invalid data or unauthorized' });
    return;
  }

  const newMessage: Partial<IMessage> = {
    sender: new mongoose.Types.ObjectId(req.user._id),
    content,
    chat: new mongoose.Types.ObjectId(chatId),
  };

  let message = await Message.create(newMessage);
  message = await message.populate('sender', 'name pic email');
  message = await message.populate({
    path: 'chat',
    populate: {
      path: 'users',
      select: 'name pic email',
      model: 'User',
    },
  });

  await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

  console.log("Message sent:", message._id); // debug
  res.json(message);
});

const allMessages = asyncHandler(async (req: AuthRequest, res: Response) => {
  console.log("allMessages called", req.params, req.user?._id);

  const { chatId } = req.params;

  if (!chatId || !req.user?._id) {
    console.log("Invalid request or user not found");
    res.status(400).json({ message: 'Chat ID required or unauthorized' });
    return;
  }

  const messages = await Message.find({ chat: chatId }).lean();
  console.log("Messages raw:", messages.length);

  const messagesPopulated = await Message.populate(messages, [
    { path: 'sender', select: 'name pic email' },
    {
      path: 'chat',
      populate: { path: 'users', select: 'name pic email', model: 'User' },
    },
  ]);
  console.log("Messages populated:", messagesPopulated.length);

  const messagesSorted = messagesPopulated
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(0, 50);

  console.log("Messages sorted and limited:", messagesSorted.length);
  res.json(messagesSorted);
});

export { sendMessage, allMessages };
