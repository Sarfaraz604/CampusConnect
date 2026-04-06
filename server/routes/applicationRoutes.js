// // const express = require("express");
// // const router = express.Router();
// // const Job = require("../models/job");
// // const Application = require("../models/application");
// // const mongoose = require("mongoose");

// // // Submit an application
// // router.post("/:jobId/apply", async (req, res) => {
// //     const { jobId } = req.params;  // This will now be the MongoDB _id
// //     const { applicantName, applicantEmail, resumeUrl, coverLetter } = req.body;

// //     if (!mongoose.Types.ObjectId.isValid(jobId)) {
// //         return res.status(400).json({ message: "Invalid Job ID" });
// //     }

// //     if (!applicantName || !applicantEmail || !resumeUrl || !coverLetter) {
// //         return res.status(400).json({ message: "Missing required fields" });
// //     }

// //     try {
// //         // Find job by MongoDB _id
// //         const job = await Job.findById(jobId);

// //         if (!job) {
// //             return res.status(404).json({ message: "Job not found" });
// //         }

// //         // Create and save application
// //         const application = new Application({
// //             jobId: job._id, // Store as an ObjectId
// //             applicantName,
// //             applicantEmail,
// //             resumeUrl,
// //             coverLetter
// //         });

// //         await application.save();
// //         res.json({ message: "Application submitted successfully!", jobId: job._id });
// //     } catch (error) {
// //         console.error("Error submitting application:", error);
// //         res.status(500).json({ message: "Internal Server Error" });
// //     }
// // });

// // module.exports = router;


// // server/routes/applicationRoutes.js
// const express = require('express');
// const router = express.Router();
// const Application = require('../models/application');
// const Job = require('../models/job');
// const User = require('../models/users');
// const { isAuthenticated } = require('../middleware/isAuthenticated');
// const { isStudent } = require('../middleware/authMiddleware');
// const mongoose = require("mongoose");

// router.post("/:jobId/apply", isAuthenticated, async (req, res) => {
//   const { jobId } = req.params;
//   const { resumeUrl, coverLetter } = req.body;

//   if (!mongoose.Types.ObjectId.isValid(jobId)) {
//     return res.status(400).json({ message: "Invalid Job ID" });
//   }

//   if (!resumeUrl || !coverLetter) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   try {
//     const job = await Job.findById(jobId);

//     if (!job) {
//       return res.status(404).json({ message: "Job not found" });
//     }

//     const application = new Application({
//       jobId,
//       jobTitle: job.title,
//       companyName: job.company,
//       authorEmail: job.authorEmail,
//       applicantId: req.user.id,
//       user: req.user.id,
//       applicantName: req.user.name,
//       applicantEmail: req.user.email,
//       coverLetter,
//       resumeUrl,
//       status: 'pending',
//     });

//     await application.save();
//     res.json({ message: "Application submitted successfully!", jobId: job._id });
//   } catch (error) {
//     console.error("Error submitting application:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });


// // // Create a new application
// // router.post('/', isAuthenticated, async (req, res) => {
// //   try {
// //     const { jobId, jobTitle, coverLetter, resumeUrl } = req.body;
    
// //     // Ensure user is authenticated
// //     if (!req.user) {
// //       return res.status(401).json({ message: 'Not authenticated' });
// //     }
    
// //     // Find the job to get author information
// //     const job = await Job.findOne({ jobId });
// //     if (!job) {
// //       return res.status(404).json({ message: 'Job not found' });
// //     }
    
// //     // Create the application
// //     const application = new Application({
// //       jobId,
// //       jobTitle,
// //       companyName: job.company,
// //       authorEmail: job.authorEmail,
// //       applicantId: req.user._id,
// //       applicantName: req.user.name,
// //       applicantEmail: req.user.email,
// //       coverLetter,
// //       resumeUrl,
// //       status: 'pending'
// //     });
    
// //     await application.save();
// //     res.status(201).json(application);
// //   } catch (error) {
// //     res.status(400).json({ message: error.message });
// //   }
// // });

// // Get applications by user ID (for applicants)
// router.get('/user/:userId', isAuthenticated, async (req, res) => {
//   try {
//     // Ensure user can only access their own applications
//     if (req.user._id.toString() !== req.params.userId && !req.user.isAdmin) {
//       return res.status(403).json({ message: 'Unauthorized' });
//     }
    
//     const applications = await Application.find({ applicantId: req.params.userId })
//       .sort({ createdAt: -1 });
    
//     res.json(applications);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // // Get applications by applicant email (for applicants)
// // router.get('/user/:email', async (req, res) => {
// //     try {
// //       const applications = await Application.find({ applicantEmail: req.params.email })
// //         .sort({ createdAt: -1 });
      
// //       // Populate job details for each application
// //       const populatedApplications = await Promise.all(applications.map(async (app) => {
// //         const job = await Job.findById(app.jobId);
// //         return {
// //           ...app.toObject(),
// //           jobTitle: job ? job.title : 'Unknown Job',
// //           companyName: job ? job.company : 'Unknown Company'
// //         };
// //       }));
      
// //       res.json(populatedApplications);
// //     } catch (error) {
// //       res.status(500).json({ message: error.message });
// //     }
// //   });

// // // GET applications by user email
// // router.get('/user/:email', isStudent, async (req, res) => {
// //   try {
// //     const { email } = req.params;

// //     // Check if logged in student matches email param
// //     if (req.user.email !== email) {
// //       return res.status(403).json({ message: "Forbidden: Access denied" });
// //     }

// //     const applications = await Application.find({ userEmail: email });
// //     res.json(applications);
// //   } catch (err) {
// //     console.error("Error fetching user applications:", err);
// //     res.status(500).json({ error: "Server error" });
// //   }
// // });

// // GET applications for logged-in user
// router.get('/user', isStudent, async (req, res) => {
//     try {
//       const applications = await Application.find({ user: req.user._id }).populate('user');
//       res.json(applications);
//     } catch (error) {
//       console.error('Error fetching applications:', error);
//       res.status(500).json({ error: 'Server error' });
//     }
//   });

// // Get applications by job author email (for job creators)
// router.get('/author/:email', async (req, res) => {
//   try {
//     // First find all jobs created by this author
//     const jobs = await Job.find({ authorEmail: req.params.email });
//     const jobIds = jobs.map(job => job._id);
    
//     // Then find all applications for these jobs
//     const applications = await Application.find({ jobId: { $in: jobIds } })
//       .sort({ createdAt: -1 });
    
//     // Populate job details
//     const populatedApplications = await Promise.all(applications.map(async (app) => {
//       const job = await Job.findById(app.jobId);
//       return {
//         ...app.toObject(),
//         jobTitle: job ? job.title : 'Unknown Job',
//         companyName: job ? job.company : 'Unknown Company'
//       };
//     }));
    
//     res.json(populatedApplications);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Get applications for a specific job
// router.get('/job/:jobId', isAuthenticated, async (req, res) => {
//   try {
//     const job = await Job.findOne({ jobId: req.params.jobId });
    
//     // Ensure user is authorized to see applications for this job
//     if (job.authorEmail.toLowerCase() !== req.user.email.toLowerCase() && !req.user.isAdmin) {
//       return res.status(403).json({ message: 'Unauthorized' });
//     }
    
//     const applications = await Application.find({ jobId: req.params.jobId })
//       .sort({ createdAt: -1 });
    
//     res.json(applications);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Update application status
// router.patch('/:applicationId/status', async (req, res) => {
//     try {
//       const application = await Application.findById(req.params.applicationId);
      
//       if (!application) {
//         return res.status(404).json({ message: 'Application not found' });
//       }
      
//       // You may want to add authorization check here
      
//       application.status = req.body.status;
//       await application.save();
      
//       res.json(application);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   });

// module.exports = router;


const express = require('express');
const router = express.Router();
const Application = require('../models/application');
const Job = require('../models/job');
const User = require('../models/users');
const { isAuthenticated } = require('../middleware/isAuthenticated');
const { isStudent, isAlumni, isStudentOrAlumni } = require('../middleware/authMiddleware');
const mongoose = require("mongoose");

// Submit an application to a job
router.post("/:jobId/apply", isAuthenticated, isStudent, async (req, res) => {
  const { jobId } = req.params;
  const { resumeUrl, coverLetter } = req.body;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ message: "Invalid Job ID" });
  }

  if (!resumeUrl || !coverLetter) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const application = new Application({
      jobId,
      jobTitle: job.title,
      companyName: job.company,
      authorEmail: job.authorEmail,
      applicantId: req.user.id,
      user: req.user.id,
      applicantName: req.user.name,
      applicantEmail: req.user.email,
      coverLetter,
      resumeUrl,
      status: 'pending',
    });

    await application.save();
    res.json({ message: "Application submitted successfully!", jobId: job._id });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// FOR STUDENTS: Get all applications submitted by the logged-in student
router.get('/my-applications', isAuthenticated, isStudentOrAlumni, async (req, res) => {
  try {
    const applications = await Application.find({ applicantId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('jobId', 'title company location salary'); // Populate job details
    
    res.json(applications);
  } catch (error) {
    console.error('Error fetching student applications:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// FOR ALUMNI: Get all applications submitted to jobs created by the logged-in alumni
router.get('/received-applications', isAuthenticated, isAlumni, async (req, res) => {
  try {
    // First find all jobs created by this alumni
    const jobs = await Job.find({ authorEmail: req.user.email });
    const jobIds = jobs.map(job => job._id);
    
    // Then find all applications for these jobs
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .sort({ createdAt: -1 })
      .populate('applicantId', 'name email'); // Populate applicant details
    
    res.json(applications);
  } catch (error) {
    console.error('Error fetching received applications:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get applications for a specific job (for alumni only)
router.get('/job/:jobId', isAuthenticated, isAlumni, async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid Job ID" });
    }

    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    // Ensure alumni is authorized to see applications for this job
    if (job.authorEmail.toLowerCase() !== req.user.email.toLowerCase() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const applications = await Application.find({ jobId })
      .sort({ createdAt: -1 })
      .populate('applicantId', 'name email');
    
    res.json(applications);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update application status (for alumni only)
router.patch('/:applicationId/status', isAuthenticated, isAlumni, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ message: "Invalid Application ID" });
    }
    
    if (!['pending', 'reviewing', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const application = await Application.findById(applicationId);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Find the associated job to verify ownership
    const job = await Job.findById(application.jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Associated job not found' });
    }
    
    // Verify the alumni is the author of the job
    if (job.authorEmail.toLowerCase() !== req.user.email.toLowerCase() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized to update this application' });
    }
    
    application.status = status;
    await application.save();
    
    res.json({ message: "Application status updated successfully", application });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;