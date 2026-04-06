// server\models\users.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['student', 'admin', 'alumni', 'visitor'], default: 'visitor' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  // New fields:
  dob: { type: Date },
  branch: {
    type: String,
    enum: [
      'Computer Science',
      'Computer Science - AI/ML',
      'Computer Science - DSA',
      'Computer Science - HCI & GT',
      'Electronics and Communication Engineering',
      'Electronics and Communication Engineering - IOT',
      'Administration'
    ],
    required: true
  },
  branchCode: {
    type: String,
    enum: ['CSE', 'CSA', 'CSD', 'CSH', 'ECE', 'ECI', 'ADM'],
    required: true
  },
  currentCompany: { type: String, default: null},
  currentCompanyRole: { type: String, default: null },
  location: { type: String },
  batch: { type: String },
  homeTown: { type: String },
  socialLinks: {  // Changed from socialLinks to socialLinks
    linkedin: { type: String, default: null },
    instagram: { type: String, default: null },
    github: { type: String, default: null },
    x: { type: String, default: null }  // Changed from twitter to x to match your data
  },
  personalEmail: { 
    type: String, 
    lowercase: true, 
    trim: true,
    validate: {
      validator: function(v) {
        // Allow null or valid email
        return v === null || /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} is not a valid personal email!`
    },
    default: null // Default to null if not provided
  }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Add password comparison method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
