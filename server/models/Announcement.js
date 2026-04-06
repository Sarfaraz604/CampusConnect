// server/models/Announcement.js

const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  type: { type: String, enum: ['event', 'achievement'], required: true },

  // Fields for events
  title: {
    type: String,
    required: function () { return this.type === 'event'; }
  },
  description: {
    type: String,
    required: function () { return this.type === 'event'; }
  },
  venue: { 
    type: String, 
    required: function () { return this.type === 'event'; }
  },
  eventDateTime: {
    type: Date,
    required: function () { return this.type === 'event'; }
  },

  // Fields for achievements
  name: {
    type: String,
    required: function () { return this.type === 'achievement'; }
  },

  // Image for event or profile photo for achievement
  imageUrl: {
    type: String,
    required: function () { return this.type === 'event'; }
  },

  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Announcement', announcementSchema);
