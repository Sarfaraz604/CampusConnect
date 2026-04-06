const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/isAuthenticated'); 
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/users');

// Get all conversations for the current user
router.get('/conversations', isAuthenticated, async (req, res) => {
  try {
    // Find conversations with detailed population
    const conversations = await Conversation.find({
      participants: req.user._id,
      deletedFor: { $ne: req.user._id } 
    })
    .populate({
      path: 'participants',
      select: 'name email profilePicture' // Changed from displayName to name
    })
    .populate({
      path: 'lastMessage',
      select: 'content createdAt read'
    })
    .sort({ updatedAt: -1 });

    // Detailed formatting
    const formattedConversations = conversations.map(conv => {
      const otherParticipant = conv.participants.find(
        p => p._id.toString() !== req.user._id.toString()
      );
      
      return {
        _id: conv._id,
        otherUser: otherParticipant ? {
          _id: otherParticipant._id,
          name: otherParticipant.name,
          email: otherParticipant.email,
          avatar: otherParticipant.profilePicture || 
            `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant.name)}`
        } : null,
        lastMessage: conv.lastMessage,
        updatedAt: conv.updatedAt,
        unreadCount: conv.unreadCount || 0 // Optional: add unread count
      };
    });
    
    res.json(formattedConversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
});

// Get messages for a specific conversation
router.get('/conversation/:conversationId', isAuthenticated, async (req, res) => {
  try {
    const { page = 1, limit = 20, lastMessageId } = req.query;
    const conversationId = req.params.conversationId;

    // Find the conversation and verify user is a participant
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Build query
    const query = { conversation: conversationId };
    
    // If lastMessageId is provided, fetch messages older than this
    if (lastMessageId) {
      const lastMessage = await Message.findById(lastMessageId);
      if (lastMessage) {
        query.createdAt = { $lt: lastMessage.createdAt };
      }
    }

    // Fetch messages
    const messages = await Message.find(query)
      .populate('sender', 'name email')
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 }) // Sort in descending order
      .limit(Number(limit));

    // Mark messages as read
    await Message.updateMany(
      { 
        conversation: conversationId,
        recipient: req.user._id,
        read: false 
      },
      { $set: { read: true } }
    );

    res.json({
      messages: messages.reverse(), // Reverse to maintain chronological order
      hasMore: messages.length === Number(limit)
    });
  } catch (error) {
    console.error('Error fetching conversation messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Get messages between current user and another user (legacy support)
router.get('/messages/:userId', isAuthenticated, async (req, res) => {
  try {
    // Verify recipient exists
    const recipient = await User.findById(req.params.userId);
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, req.params.userId] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [req.user._id, req.params.userId]
      });
      await conversation.save();
    }

    // Fetch messages
    const messages = await Message.find({
      conversation: conversation._id
    })
    .populate('sender', 'name email profilePicture')
    .populate('recipient', 'name email profilePicture')
    .sort({ createdAt: 1 });
    
    // Mark unread messages as read
    await Message.updateMany(
      { 
        conversation: conversation._id,
        recipient: req.user._id,
        read: false
      },
      { $set: { read: true } }
    );
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Get unread message count with breakdown
router.get('/unread', isAuthenticated, async (req, res) => {
  try {
    // Total unread messages count
    const totalUnreadCount = await Message.countDocuments({
      recipient: req.user._id,
      read: false
    });

    // Unread count per conversation
    const aggregateResult = await Message.aggregate([
      { 
        $match: { 
          recipient: req.user._id,
          read: false 
        } 
      },
      {
        $group: {
          _id: '$conversation',
          unreadCount: { $sum: 1 }
        }
      }
    ]);
    
    // Format the result after awaiting the promise
    const unreadByConversation = aggregateResult.map(item => ({
      conversationId: item._id,
      unreadCount: item.unreadCount
    }));

    res.json({
      totalUnreadCount,
      unreadByConversation
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send a new message
router.post('/send', isAuthenticated, async (req, res) => {
  try {
    console.log('Received message send request:', {
      sender: req.user._id,
      ...req.body
    });

    const { recipientId, content } = req.body;

    // Validate input
    if (!recipientId) {
      return res.status(400).json({ error: 'Recipient ID is required' });
    }
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Message content is required' });
    }

    // Verify recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [req.user._id, recipientId]
      });
      await conversation.save();
    }

    // Create new message
    const newMessage = new Message({
      conversation: conversation._id,
      sender: req.user._id,
      recipient: recipientId,
      content: content.trim(),
      read: false
    });

    await newMessage.save();

    // Update conversation
    conversation.lastMessage = newMessage._id;
    conversation.updatedAt = new Date();
    await conversation.save();

    // Populate message for response
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name email')
      .populate('recipient', 'name email');

    console.log('Message sent successfully:', populatedMessage);

    // Emit Socket.IO event to notify recipient in real-time
    const recipientIdString = recipientId.toString();
    console.log('🔔 Emitting newMessage event to room:', recipientIdString);
    console.log('📤 Message data:', {
      from: populatedMessage.sender.email,
      to: populatedMessage.recipient.email,
      content: populatedMessage.content
    });
    req.app.locals.io.to(recipientIdString).emit('newMessage', populatedMessage);
    console.log('✅ Event emitted successfully');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
});


router.delete('/conversation/:conversationId', isAuthenticated, async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const userId = req.user._id;
    
    // Find the conversation
    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Check if user is a participant
    if (!conversation.participants.some(p => p.toString() === userId.toString())) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Initialize deletedFor array if it doesn't exist
    if (!conversation.deletedFor) {
      conversation.deletedFor = [];
    }
    
    // Add current user to deletedFor if not already there
    if (!conversation.deletedFor.includes(userId)) {
      conversation.deletedFor.push(userId);
    }
    
    // Check if all participants have deleted the conversation
    const allDeleted = conversation.participants.every(participantId => 
      conversation.deletedFor.some(deletedId => 
        deletedId.toString() === participantId.toString()
      )
    );

    // If all participants have deleted, remove the conversation and messages completely
    if (allDeleted) {
      await Conversation.findByIdAndDelete(conversationId);
      await Message.deleteMany({ conversation: conversationId });
      console.log('All users deleted conversation, removing from database');
    } else {
      // Otherwise just save the updated deletedFor array
      await conversation.save();
      console.log('Marked conversation as deleted for user');
    }

    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;