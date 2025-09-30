import { Router } from 'express';
import { body, param } from 'express-validator';
import { sendMessage, sendMessageStream, deleteMessage } from '../controllers/chatController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { chatLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticate);

router.post(
  '/message',
  chatLimiter,
  [
    body('conversationId').isMongoId().withMessage('Invalid conversation ID'),
    body('message').trim().isLength({ min: 1, max: 5000 }).withMessage('Message must be between 1 and 5000 characters')
  ],
  validate,
  sendMessage
);

router.post(
  '/message/stream',
  chatLimiter,
  [
    body('conversationId').isMongoId().withMessage('Invalid conversation ID'),
    body('message').trim().isLength({ min: 1, max: 5000 }).withMessage('Message must be between 1 and 5000 characters')
  ],
  validate,
  sendMessageStream
);

router.delete(
  '/message/:messageId',
  [param('messageId').isMongoId().withMessage('Invalid message ID')],
  validate,
  deleteMessage
);

export default router;