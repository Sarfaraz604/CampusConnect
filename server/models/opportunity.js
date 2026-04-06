// server/models/opportunity.js
const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
  projectId: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['startup', 'research', 'innovation', 'patent'],
    required: true
  },
  details: {
    type: String,
    required: true
  },
  authorEmail: {
    type: String,
    required: true,
    ref: 'User'
  },
  tags: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

// Generate unique project ID before validation
OpportunitySchema.pre('validate', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Opportunity').countDocuments();
    this.projectId = `PRJ-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Opportunity', OpportunitySchema);
