import asyncHandler from 'express-async-handler';
import { Response } from 'express';
import Chat, { IChat } from '../models/chatModel';
import { Types } from 'mongoose';
import { AuthRequest } from '../types/AuthRequest'; // <- your custom type

// Interface for populated user
interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
  pic: string;
}

// Interface for populated message
interface PopulatedMessage {
  _id: string;
  sender: PopulatedUser;
  content: string;
  chat: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for populated chat
interface PopulatedChat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: PopulatedUser[];
  latestMessage?: PopulatedMessage;
  groupAdmin?: PopulatedUser;
  createdAt: Date;
  updatedAt: Date;
}

// @desc    Access or create one-on-one chat
// @route   POST /api/chat
// @access  Private
const accessChat = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userId } = req.body;

  if (!userId || !req.user?._id) {
    res.status(400).json({ message: 'User ID not provided or unauthorized' });
    return;
  }

  const isChat = await Chat.find({
    isGroupChat: false,
    users: { $all: [req.user._id, userId] },
  })
    .populate('users', 'name email pic')
    .populate({
      path: 'latestMessage',
      populate: {
        path: 'sender',
        select: 'name pic email',
      },
    })
    .lean();

  if (isChat.length > 0) {
    res.send(isChat[0]);
    return;
  }

  const chatData: Partial<IChat> = {
    chatName: 'sender',
    isGroupChat: false,
    users: [new Types.ObjectId(req.user._id), new Types.ObjectId(userId)],
  };

  const createdChat = await Chat.create(chatData);
  const fullChat = await Chat.findById(createdChat._id)
    .populate('users', 'name email pic')
    .lean();

  res.status(200).json(fullChat);
});

// @desc    Fetch all chats for logged-in user
// @route   GET /api/chat
// @access  Private
const fetchChats = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user?._id) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const chats = await Chat.find({ users: req.user._id })
    .populate('users', 'name email pic')
    .populate({
      path: 'latestMessage',
      populate: {
        path: 'sender',
        select: 'name pic email',
      },
    })
    .sort({ updatedAt: -1 })
    .lean();

  res.json(chats);
});

export { accessChat, fetchChats };
