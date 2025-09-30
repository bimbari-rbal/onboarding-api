"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const chatController_1 = require("../controllers/chatController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.post('/message', rateLimiter_1.chatLimiter, [
    (0, express_validator_1.body)('conversationId').isMongoId().withMessage('Invalid conversation ID'),
    (0, express_validator_1.body)('message').trim().isLength({ min: 1, max: 5000 }).withMessage('Message must be between 1 and 5000 characters')
], validation_1.validate, chatController_1.sendMessage);
router.post('/message/stream', rateLimiter_1.chatLimiter, [
    (0, express_validator_1.body)('conversationId').isMongoId().withMessage('Invalid conversation ID'),
    (0, express_validator_1.body)('message').trim().isLength({ min: 1, max: 5000 }).withMessage('Message must be between 1 and 5000 characters')
], validation_1.validate, chatController_1.sendMessageStream);
router.delete('/message/:messageId', [(0, express_validator_1.param)('messageId').isMongoId().withMessage('Invalid message ID')], validation_1.validate, chatController_1.deleteMessage);
exports.default = router;
//# sourceMappingURL=chatRoutes.js.map