import express from 'express';
import { getChatHistory, sendChatMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, getChatHistory)
  .post(protect, sendChatMessage);

export default router;
