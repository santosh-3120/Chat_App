import asyncHandler from 'express-async-handler';
import { Response } from 'express';
import User, { IUser } from '../models/userModel';
import generateToken from '../utils/generateToken';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../types/AuthRequest'; // <- import your custom request type

// @desc    Register a new user
// @route   POST /api/user
// @access  Public
const registerUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please enter all fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password, pic });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    pic: user.pic,
    token: generateToken(user._id.toString()),
  });
});

// @desc    Authenticate user & get token
// @route   POST /api/user/login
// @access  Public
const loginUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).lean();
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Search users
// @route   GET /api/user?search=
// @access  Private
const searchUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

  if (!req.user?._id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const users = await User.find({ ...keyword, _id: { $ne: req.user._id } })
    .select('name email pic socketId lastSeen') // Include socketId and lastSeen
    .lean();

  res.json(users);
});

export { registerUser, loginUser, searchUsers };
