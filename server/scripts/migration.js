// scripts/message-migration.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/users');

async function migrateMessagesAndConversations() {
  try {
    // Verify MongoDB URI
    console.log("Mongo URI:", process.env.MONGO_URI);
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB successfully');

    // Find all existing messages
    const messages = await Message.find();
    console.log(`Total messages found: ${messages.length}`);

    // Track created conversations to avoid duplicates
    const conversationMap = new Map();

    // Migrate messages
    for (const message of messages) {
      try {
        // Create or find conversation
        const participantIds = [
          message.sender.toString(), 
          message.recipient.toString()
        ].sort();

        // Generate a unique key for the conversation
        const conversationKey = participantIds.join('_');

        // Check if conversation already exists
        let conversation = conversationMap.get(conversationKey);

        if (!conversation) {
          // Find existing conversation or create new
          conversation = await Conversation.findOne({
            participants: { $all: participantIds }
          });

          if (!conversation) {
            conversation = new Conversation({
              participants: participantIds,
              lastMessage: message._id,
              updatedAt: message.createdAt
            });
            await conversation.save();
          }

          // Cache the conversation
          conversationMap.set(conversationKey, conversation);
        }

        // Update message with conversation reference
        message.conversation = conversation._id;
        await message.save();

        // Update conversation's last message if needed
        if (!conversation.lastMessage || 
            message.createdAt > (await Message.findById(conversation.lastMessage)).createdAt) {
          conversation.lastMessage = message._id;
          conversation.updatedAt = message.createdAt;
          await conversation.save();
        }

      } catch (messageError) {
        console.error(`Error processing message ${message._id}:`, messageError);
      }
    }

    console.log('Migration completed successfully');
    
    // Additional verification
    const conversationsCount = await Conversation.countDocuments();
    const messagesWithConversation = await Message.countDocuments({ 
      conversation: { $exists: true } 
    });

    console.log(`Total Conversations: ${conversationsCount}`);
    console.log(`Messages with Conversation Reference: ${messagesWithConversation}`);

    // Close connection
    await mongoose.connection.close();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateMessagesAndConversations();