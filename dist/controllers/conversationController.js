"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConversation = exports.updateConversation = exports.getConversation = exports.getConversations = exports.createConversation = void 0;
const Conversation_1 = require("../models/Conversation");
const Message_1 = require("../models/Message");
const createConversation = async (req, res) => {
    try {
        const userId = req.userId;
        const { title } = req.body;
        const conversation = await Conversation_1.Conversation.create({
            userId,
            title: title || 'New Conversation'
        });
        res.status(201).json({
            message: 'Conversation created successfully',
            conversation: {
                id: conversation._id,
                title: conversation.title,
                createdAt: conversation.createdAt,
                updatedAt: conversation.updatedAt
            }
        });
    }
    catch (error) {
        console.error('Create conversation error:', error);
        res.status(500).json({ error: 'Failed to create conversation' });
    }
};
exports.createConversation = createConversation;
const getConversations = async (req, res) => {
    try {
        const userId = req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const conversations = await Conversation_1.Conversation.find({ userId })
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        const total = await Conversation_1.Conversation.countDocuments({ userId });
        res.status(200).json({
            conversations: conversations.map(conv => ({
                id: conv._id,
                title: conv.title,
                createdAt: conv.createdAt,
                updatedAt: conv.updatedAt
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ error: 'Failed to get conversations' });
    }
};
exports.getConversations = getConversations;
const getConversation = async (req, res) => {
    try {
        const userId = req.userId;
        const { conversationId } = req.params;
        const conversation = await Conversation_1.Conversation.findOne({
            _id: conversationId,
            userId
        });
        if (!conversation) {
            res.status(404).json({ error: 'Conversation not found' });
            return;
        }
        const messages = await Message_1.Message.find({ conversationId })
            .sort({ createdAt: 1 })
            .lean();
        res.status(200).json({
            conversation: {
                id: conversation._id,
                title: conversation.title,
                createdAt: conversation.createdAt,
                updatedAt: conversation.updatedAt
            },
            messages: messages.map(msg => ({
                id: msg._id,
                role: msg.role,
                content: msg.content,
                createdAt: msg.createdAt
            }))
        });
    }
    catch (error) {
        console.error('Get conversation error:', error);
        res.status(500).json({ error: 'Failed to get conversation' });
    }
};
exports.getConversation = getConversation;
const updateConversation = async (req, res) => {
    try {
        const userId = req.userId;
        const { conversationId } = req.params;
        const { title } = req.body;
        const conversation = await Conversation_1.Conversation.findOneAndUpdate({ _id: conversationId, userId }, { title }, { new: true });
        if (!conversation) {
            res.status(404).json({ error: 'Conversation not found' });
            return;
        }
        res.status(200).json({
            message: 'Conversation updated successfully',
            conversation: {
                id: conversation._id,
                title: conversation.title,
                updatedAt: conversation.updatedAt
            }
        });
    }
    catch (error) {
        console.error('Update conversation error:', error);
        res.status(500).json({ error: 'Failed to update conversation' });
    }
};
exports.updateConversation = updateConversation;
const deleteConversation = async (req, res) => {
    try {
        const userId = req.userId;
        const { conversationId } = req.params;
        const conversation = await Conversation_1.Conversation.findOneAndDelete({
            _id: conversationId,
            userId
        });
        if (!conversation) {
            res.status(404).json({ error: 'Conversation not found' });
            return;
        }
        await Message_1.Message.deleteMany({ conversationId });
        res.status(200).json({
            message: 'Conversation deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete conversation error:', error);
        res.status(500).json({ error: 'Failed to delete conversation' });
    }
};
exports.deleteConversation = deleteConversation;
//# sourceMappingURL=conversationController.js.map