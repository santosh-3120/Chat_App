import express from 'express';
import { accessChat, fetchChats } from '../controllers/chatControllers';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, accessChat);
router.get('/', protect, fetchChats);

export default router;