import { Router } from 'express';
import { body, param } from 'express-validator';
import { sendMessage, sendMessageStream, deleteMessage } from '../controllers/chatController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { chatLimiter } from '../middleware/rateLimiter';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/chat/message:
 *   post:
 *     tags: [Chat]
 *     summary: Send a message
 *     description: Send a message and receive AI response (non-streaming)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversationId
 *               - message
 *             properties:
 *               conversationId:
 *                 type: string
 *                 description: Conversation ID
 *                 example: 507f1f77bcf86cd799439011
 *               message:
 *                 type: string
 *                 description: User message content
 *                 example: What is Node.js?
 *     responses:
 *       200:
 *         description: Message sent and response received
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userMessage:
 *                   $ref: '#/components/schemas/Message'
 *                 assistantMessage:
 *                   $ref: '#/components/schemas/Message'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Conversation not found
 *       429:
 *         description: Too many requests
 */
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

/**
 * @swagger
 * /api/chat/message/stream:
 *   post:
 *     tags: [Chat]
 *     summary: Send a message with streaming response
 *     description: Send a message and receive AI response in real-time using Server-Sent Events
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conversationId
 *               - message
 *             properties:
 *               conversationId:
 *                 type: string
 *                 description: Conversation ID
 *                 example: 507f1f77bcf86cd799439011
 *               message:
 *                 type: string
 *                 description: User message content
 *                 example: Tell me about TypeScript
 *     responses:
 *       200:
 *         description: Server-Sent Events stream
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 *               description: SSE stream with chunks of AI response
 *               example: |
 *                 data: {"type":"user_message","message":{"id":"msg-id","role":"user","content":"Tell me about TypeScript"}}
 *
 *                 data: {"type":"chunk","content":"TypeScript"}
 *
 *                 data: {"type":"chunk","content":" is a programming language..."}
 *
 *                 data: {"type":"done","message":{"id":"msg-id-2","role":"assistant","content":"TypeScript is a programming language..."}}
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Conversation not found
 *       429:
 *         description: Too many requests
 */
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

/**
 * @swagger
 * /api/chat/message/{messageId}:
 *   delete:
 *     tags: [Chat]
 *     summary: Delete a message
 *     description: Delete a specific message from a conversation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Message or conversation not found
 */
router.delete(
  '/message/:messageId',
  [param('messageId').isMongoId().withMessage('Invalid message ID')],
  validate,
  deleteMessage
);

export default router;