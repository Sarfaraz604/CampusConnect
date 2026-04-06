const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Add conversation reference
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000, // Prevent extremely long messages
    validate: {
      validator: function(v) {
        // Basic content validation
        return v.length > 0 && v.length <= 1000;
      },
      message: props => `Message length must be between 1 and 1000 characters!`
    }
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Optional: Add metadata for tracking
  metadata: {
    ipAddress: String,
    userAgent: String
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Sanitization method (optional)
messageSchema.methods.sanitizeContent = function() {
  // Remove potentially harmful content
  this.content = this.content
    .replace(/<script>.*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
  return this;
};

// Create compound index for efficient queries
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;