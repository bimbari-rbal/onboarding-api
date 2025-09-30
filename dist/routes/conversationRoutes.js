"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const conversationController_1 = require("../controllers/conversationController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.post('/', [(0, express_validator_1.body)('title').optional().trim().isLength({ min: 1, max: 200 })], validation_1.validate, conversationController_1.createConversation);
router.get('/', conversationController_1.getConversations);
router.get('/:conversationId', [(0, express_validator_1.param)('conversationId').isMongoId().withMessage('Invalid conversation ID')], validation_1.validate, conversationController_1.getConversation);
router.put('/:conversationId', [
    (0, express_validator_1.param)('conversationId').isMongoId().withMessage('Invalid conversation ID'),
    (0, express_validator_1.body)('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters')
], validation_1.validate, conversationController_1.updateConversation);
router.delete('/:conversationId', [(0, express_validator_1.param)('conversationId').isMongoId().withMessage('Invalid conversation ID')], validation_1.validate, conversationController_1.deleteConversation);
exports.default = router;
//# sourceMappingURL=conversationRoutes.js.map