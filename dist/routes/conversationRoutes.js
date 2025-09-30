"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const conversationController_1 = require("../controllers/conversationController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
/**
 * @swagger
 * /api/conversations:
 *   post:
 *     tags: [Conversations]
 *     summary: Create a new conversation
 *     description: Start a new chat conversation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: My Chat Session
 *     responses:
 *       201:
 *         description: Conversation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 conversation:
 *                   $ref: '#/components/schemas/Conversation'
 *       401:
 *         description: Unauthorized
 */
router.post('/', [(0, express_validator_1.body)('title').optional().trim().isLength({ min: 1, max: 200 })], validation_1.validate, conversationController_1.createConversation);
/**
 * @swagger
 * /api/conversations:
 *   get:
 *     tags: [Conversations]
 *     summary: Get all conversations
 *     description: Retrieve all conversations for authenticated user with pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of conversations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 conversations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Conversation'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/', conversationController_1.getConversations);
/**
 * @swagger
 * /api/conversations/{conversationId}:
 *   get:
 *     tags: [Conversations]
 *     summary: Get conversation details
 *     description: Retrieve a specific conversation with all messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation ID
 *     responses:
 *       200:
 *         description: Conversation details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 conversation:
 *                   $ref: '#/components/schemas/Conversation'
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Conversation not found
 */
router.get('/:conversationId', [(0, express_validator_1.param)('conversationId').isMongoId().withMessage('Invalid conversation ID')], validation_1.validate, conversationController_1.getConversation);
/**
 * @swagger
 * /api/conversations/{conversationId}:
 *   put:
 *     tags: [Conversations]
 *     summary: Update conversation
 *     description: Update conversation title
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Title
 *     responses:
 *       200:
 *         description: Conversation updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Conversation not found
 */
router.put('/:conversationId', [
    (0, express_validator_1.param)('conversationId').isMongoId().withMessage('Invalid conversation ID'),
    (0, express_validator_1.body)('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters')
], validation_1.validate, conversationController_1.updateConversation);
/**
 * @swagger
 * /api/conversations/{conversationId}:
 *   delete:
 *     tags: [Conversations]
 *     summary: Delete conversation
 *     description: Delete a conversation and all its messages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Conversation ID
 *     responses:
 *       200:
 *         description: Conversation deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Conversation not found
 */
router.delete('/:conversationId', [(0, express_validator_1.param)('conversationId').isMongoId().withMessage('Invalid conversation ID')], validation_1.validate, conversationController_1.deleteConversation);
exports.default = router;
//# sourceMappingURL=conversationRoutes.js.map