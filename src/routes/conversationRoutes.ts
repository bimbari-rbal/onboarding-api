import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createConversation,
  getConversations,
  getConversation,
  updateConversation,
  deleteConversation
} from '../controllers/conversationController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  [body('title').optional().trim().isLength({ min: 1, max: 200 })],
  validate,
  createConversation
);

router.get('/', getConversations);

router.get(
  '/:conversationId',
  [param('conversationId').isMongoId().withMessage('Invalid conversation ID')],
  validate,
  getConversation
);

router.put(
  '/:conversationId',
  [
    param('conversationId').isMongoId().withMessage('Invalid conversation ID'),
    body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters')
  ],
  validate,
  updateConversation
);

router.delete(
  '/:conversationId',
  [param('conversationId').isMongoId().withMessage('Invalid conversation ID')],
  validate,
  deleteConversation
);

export default router;