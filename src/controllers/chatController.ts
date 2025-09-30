import { Request, Response } from 'express';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';
import { AuthRequest } from '../middleware/auth';
import { stackAIService } from '../services/stackAIService';

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthRequest).userId;
    const { conversationId, message } = req.body;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId
    });

    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    const userMessage = await Message.create({
      conversationId,
      role: 'user',
      content: message
    });

    const previousMessages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .limit(20)
      .lean();

    const chatHistory = previousMessages.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content
    }));

    const aiResponse = await stackAIService.sendMessage(chatHistory);

    if (aiResponse.error) {
      res.status(500).json({ error: 'Failed to get AI response', details: aiResponse.error });
      return;
    }

    const assistantMessage = await Message.create({
      conversationId,
      role: 'assistant',
      content: aiResponse.content
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      updatedAt: new Date()
    });

    res.status(200).json({
      userMessage: {
        id: userMessage._id,
        role: userMessage.role,
        content: userMessage.content,
        createdAt: userMessage.createdAt
      },
      assistantMessage: {
        id: assistantMessage._id,
        role: assistantMessage.role,
        content: assistantMessage.content,
        createdAt: assistantMessage.createdAt
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const sendMessageStream = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthRequest).userId;
    const { conversationId, message } = req.body;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId
    });

    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    const userMessage = await Message.create({
      conversationId,
      role: 'user',
      content: message
    });

    const previousMessages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .limit(20)
      .lean();

    const chatHistory = previousMessages.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content
    }));

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.write(`data: ${JSON.stringify({ type: 'user_message', message: { id: userMessage._id, role: userMessage.role, content: userMessage.content } })}\n\n`);

    let fullResponse = '';

    try {
      for await (const chunk of stackAIService.sendMessageStream(chatHistory)) {
        fullResponse += chunk;
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
      }

      const assistantMessage = await Message.create({
        conversationId,
        role: 'assistant',
        content: fullResponse
      });

      await Conversation.findByIdAndUpdate(conversationId, {
        updatedAt: new Date()
      });

      res.write(`data: ${JSON.stringify({ type: 'done', message: { id: assistantMessage._id, role: assistantMessage.role, content: assistantMessage.content } })}\n\n`);
    } catch (streamError) {
      res.write(`data: ${JSON.stringify({ type: 'error', error: 'Streaming failed' })}\n\n`);
    }

    res.end();
  } catch (error) {
    console.error('Send message stream error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to send message' });
    }
  }
};

export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthRequest).userId;
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    const conversation = await Conversation.findOne({
      _id: message.conversationId,
      userId
    });

    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    await Message.findByIdAndDelete(messageId);

    res.status(200).json({
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};