import express from 'express';
import Message from '../models/Message.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all messages for current user
router.get('/', authenticate, async (req, res) => {
  try {
    const { conversationWith, unreadOnly } = req.query;
    const query = {
      $or: [
        { senderId: req.user._id },
        { receiverId: req.user._id }
      ]
    };

    if (conversationWith) {
      query.$or = [
        { senderId: req.user._id, receiverId: conversationWith },
        { senderId: conversationWith, receiverId: req.user._id }
      ];
    }

    if (unreadOnly === 'true') {
      query.isRead = false;
      query.receiverId = req.user._id;
    }

    const messages = await Message.find(query)
      .populate('senderId', 'name email role')
      .populate('receiverId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get unread message count
router.get('/unread/count', authenticate, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.user._id,
      isRead: false
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Send new message
router.post('/', authenticate, async (req, res) => {
  try {
    const { receiverId, content, type } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ 
        message: 'Please provide receiverId and content' 
      });
    }

    const message = await Message.create({
      senderId: req.user._id,
      receiverId,
      content,
      type: type || 'text',
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name email role')
      .populate('receiverId', 'name email role');

    res.status(201).json({
      message: 'Message sent successfully',
      data: populatedMessage,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Mark message as read
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only receiver can mark as read
    if (message.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.json({
      message: 'Message marked as read',
      data: message,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Mark all messages as read
router.put('/read/all', authenticate, async (req, res) => {
  try {
    const { senderId } = req.body;

    const query = {
      receiverId: req.user._id,
      isRead: false
    };

    if (senderId) {
      query.senderId = senderId;
    }

    await Message.updateMany(query, {
      isRead: true,
      readAt: new Date()
    });

    res.json({ message: 'All messages marked as read' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Delete message
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only sender or receiver can delete
    if (message.senderId.toString() !== req.user._id.toString() &&
        message.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Message.findByIdAndDelete(req.params.id);

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

export default router;

