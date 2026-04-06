// const mongoose = require('mongoose');

// const ApplicationSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   jobId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Job',
//     required: true
//   },
//   applicantName: {
//     type: String,
//     required: true
//   },
//   applicantEmail: {
//     type: String,
//     required: true
//   },
//   resumeUrl: {
//     type: String,
//     required: true
//   },
//   coverLetter: {
//     type: String,
//     required: false
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'reviewed', 'accepted', 'rejected'],
//     default: 'pending'
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('Application', ApplicationSchema);

// server/models/application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobId: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  authorEmail: {
    type: String,
    required: true
  },
  applicantId: {
    type: String,
    required: true
  },
  applicantName: {
    type: String,
    required: true
  },
  applicantEmail: {
    type: String,
    required: true
  },
  coverLetter: {
    type: String,
    required: true
  },
  resumeUrl: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'interviewing', 'accepted', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);