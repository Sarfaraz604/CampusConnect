// server/models/donation.js
const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  batch: {
    type: String,
    required: true
  },
  email: { 
    type: String, 
    required: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  purpose: {
    type: String,
    enum: ['startup', 'research', 'innovation','patent', 'general'],
    required: true
  },
  comments: {
    type: String
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Donation', DonationSchema);