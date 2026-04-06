// server\models\job.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  jobId: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  salary: {
    type: String,
    required: false
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  responsibilities: {
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
    enum: ['active', 'filled', 'expired', 'pending'], //active == show , filled == notShow (can delete now)
    //expired == delete from DB 
    default: 'pending'
  },
  // applicationUrl: {
  //   type: String,
  //   required: false
  // },
  applicationDeadline: {
    type: Date,
    required: false
  }
}, { timestamps: true });

// Generate unique job ID before validation
JobSchema.pre('validate', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Job').countDocuments();
    this.jobId = `JOB-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Job', JobSchema);