import express from 'express';
import { registerUser, loginUser, searchUsers } from '../controllers/userControllers';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/', protect, searchUsers);

export default router;