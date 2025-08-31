import express from 'express';
import { sendMessage, allMessages } from '../controllers/messageControllers';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/:chatId', protect, allMessages);

export default router;