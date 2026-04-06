const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

module.exports = (io, sessionMiddleware) => {
  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    console.log('Socket Connected:', socket.user.email, 'Socket ID:', socket.id);
    
    // User joins their personal room using their user ID
    socket.join(userId);
    console.log('User joined room:', userId);

    socket.on('sendMessage', async (data) => {
      try {
        const { recipientId, content } = data;
    
        // Find or create conversation
        let conversation = await Conversation.findOne({
          participants: { $all: [socket.user._id, recipientId] }
        });
    
        if (!conversation) {
          conversation = new Conversation({
            participants: [socket.user._id, recipientId]
          });
          await conversation.save();
        }
    
        // Create new message with conversation reference
        const newMessage = new Message({
          conversation: conversation._id,
          sender: socket.user._id,
          recipient: recipientId,
          content,
          read: false
        });
    
        await newMessage.save();
    
        // Update conversation's last message
        conversation.lastMessage = newMessage._id;
        conversation.updatedAt = new Date();
        await conversation.save();
    
        // Populate message
        const populatedMessage = await Message.findById(newMessage._id)
          .populate('sender', 'name email')
          .populate('recipient', 'name email')
          .populate('conversation');
    
        // Emit to recipient
        io.to(recipientId.toString()).emit('newMessage', populatedMessage);
        
        // Confirm to sender
        socket.emit('messageSent', populatedMessage);
    
      } catch (error) {
        console.error('Message sending error:', error);
        socket.emit('messageError', { 
          error: 'Failed to send message',
          details: error.message
        });
      }
    });

    // Disconnect Handler
    socket.on('disconnect', () => {
      console.log('Socket Disconnected:', socket.user.email);
    });
  });
};