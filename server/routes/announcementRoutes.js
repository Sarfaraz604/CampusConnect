// server/routes/announcementRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { cloudinary } = require('../utils/cloudinary');
const Announcement = require('../models/Announcement');
const { isAlumni } = require('../middleware/authMiddleware');

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error("Only images are allowed"), false);
    }
    cb(null, true);
  }
});

// POST /api/announcements/achievement
// Alumni can create an achievement; status defaults to 'pending'
router.post('/achievement', isAlumni, upload.single('image'), async (req, res) => {
  try {
    const { title, description, name } = req.body;
    let imageUrl = '';
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "achievements" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      imageUrl = uploadResult.secure_url;
    }
    
    const newAnnouncement = new Announcement({
      type: 'achievement',
      title,
      description,
      imageUrl,
      name, // Alumni's name should be provided by frontend
      // status defaults to 'pending' as per the model definition
    });
    
    const savedAnnouncement = await newAnnouncement.save();
    res.status(201).json({ message: 'Achievement created, pending approval', data: savedAnnouncement });
  } catch (err) {
    console.error("❌ Error creating achievement:", err);
    res.status(500).json({ error: 'Failed to create achievement' });
  }
});

// GET /api/announcements
// Return only approved announcements for normal users
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    console.error("❌ Error fetching announcements:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
