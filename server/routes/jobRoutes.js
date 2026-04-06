// server\routes\jobRoutes.js
const express = require('express');
const router = express.Router();
const Job = require('../models/job');
const User = require('../models/users');
const { isAuthenticated } = require('../middleware/isAuthenticated');
const { isAlumni } = require("../middleware/authMiddleware");

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 });
    
    // Fetch author details for each job
    const jobsWithAuthors = await Promise.all(
      jobs.map(async (job) => {
        const author = await User.findOne({ email: job.authorEmail });
        return {
          ...job.toObject(),
          authorName: author ? author.name : 'Unknown Author',
          companyName: author ? author.companyName : 'Unknown Company'
        };
      })
    );
    
    res.json(jobsWithAuthors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new job
router.post("/createJob", isAuthenticated, isAlumni, async (req, res) => {
  try {
    console.log('Request reached createJob');
    console.log('Is authenticated:', req.isAuthenticated());
    console.log('User in request:', req.user);
    
    if (!req.user) {
      console.log('No user found in request');
      return res.status(401).json({ message: 'No authenticated user found' });
    }

    // Get the current count for jobId
    const count = await Job.countDocuments();
    const jobId = `JOB-${(count + 1).toString().padStart(4, '0')}`;

    const jobData = {
      jobId,
      title: req.body.title,
      company: req.body.company,
      description: req.body.description,
      location: req.body.location,
      salary: req.body.salary,
      employmentType: req.body.employmentType,
      requirements: req.body.requirements,
      responsibilities: req.body.responsibilities,
      authorEmail: req.user.email,
      tags: req.body.tags || [],
      status: 'pending',
      // applicationUrl: req.body.applicationUrl,
      applicationDeadline: req.body.applicationDeadline
    };

    console.log('Creating job with data:', jobData);

    const job = new Job(jobData);
    await job.save();
    
    console.log('Job created successfully:', job);
    res.status(201).json(job);
  } catch (error) {
    console.error('Error in createJob:', error);
    res.status(400).json({ 
      message: error.message,
      details: error.errors // Include mongoose validation errors if any
    });
  }
});
// Filter jobs by criteria
// server/routes/jobRoutes.js - updated filter endpoint
// GET /api/jobs/filter - filter jobs with pagination
router.get('/filter', async (req, res) => {
  try {
    const { employmentType, location, tag, keyword, status, page, limit } = req.query;
    const filter = {};

    if (employmentType) {
      filter.employmentType = { $regex: employmentType, $options: 'i' };
    }
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    if (tag) {
      filter.tags = { $in: [tag] };
    }
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }
    if (status) {
      filter.status = status;
    }

    // Default to page 1 and limit 10 if not provided
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination metadata
    const total = await Job.countDocuments(filter);
    // Fetch jobs using skip and limit
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Optionally, attach author details if needed
    const jobsWithAuthors = await Promise.all(
      jobs.map(async (job) => {
        const author = await User.findOne({ email: job.authorEmail });
        return {
          ...job.toObject(),
          authorName: author ? author.name : 'Unknown Author',
          companyName: author ? author.companyName : 'Unknown Company'
        };
      })
    );

    res.json({
      data: jobsWithAuthors,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get job by ID
router.get('/:jobId', async (req, res) => {
  try {
    const job = await Job.findOne({ jobId: req.params.jobId });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    const author = await User.findOne({ email: job.authorEmail });
    const jobWithAuthor = {
      ...job.toObject(),
      authorName: author ? author.name : 'Unknown Author',
      companyName: author ? author.companyName : 'Unknown Company'
    };
    
    res.json(jobWithAuthor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Get jobs by author email
router.get('/author/:email', async (req, res) => {
  try {
    const jobs = await Job.find({ authorEmail: req.params.email });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update job status
router.patch('/:jobId/status', isAuthenticated, async (req, res) => {
  try {
    const job = await Job.findOne({ jobId: req.params.jobId });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Check if the user is the author of the job
    if (job.authorEmail !== req.user.email) {
      return res.status(403).json({ message: 'Unauthorized to update this job' });
    }
    
    job.status = req.body.status;
    await job.save();
    
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



module.exports = router;


