// server/routes/adminAnnouncementRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { cloudinary } = require('../utils/cloudinary');
const Announcement = require('../models/Announcement');
const { verifyAdmin } = require('../middleware/authMiddleware');

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

// 1️⃣ Create Event (Admin Only)
// Route: POST /api/admin/announcements/event
router.post('/event', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, description, venue, eventDateTime, name } = req.body;
    // Convert eventDateTime string to a Date object
    const eventDate = eventDateTime ? new Date(eventDateTime) : null;

    let imageUrl = '';
    if (req.file) {
      // Upload the image to Cloudinary under the "events" folder
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "events" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      imageUrl = uploadResult.secure_url;
    }

    const newEvent = new Announcement({
      type: 'event',
      title,
      description,
      venue,
      eventDateTime: eventDate,
      imageUrl,
      name: name || 'Admin',
      status: 'approved'  // Admin-created events are approved by default
    });

    const savedEvent = await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', data: savedEvent });
  } catch (err) {
    console.error("❌ Error creating event:", err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// 2️⃣ Get All Announcements (Admin sees everything)
// Route: GET /api/admin/announcements/all
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    console.error("❌ Error fetching all announcements:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 3️⃣ Approve Announcement (usually pending achievement)
// Route: PATCH /api/admin/announcements/:id/approve
router.patch('/:id/approve', verifyAdmin, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ error: 'Announcement not found' });

    announcement.status = 'approved';
    await announcement.save();
    res.json({ message: 'Announcement approved', data: announcement });
  } catch (error) {
    console.error("❌ Error approving announcement:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 4️⃣ Reject Announcement (set status='rejected' or delete)
// Route: PATCH /api/admin/announcements/:id/reject
router.patch('/:id/reject', verifyAdmin, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ error: 'Announcement not found' });

    // Option A: Set status to 'rejected'
    announcement.status = 'rejected';
    await announcement.save();
    res.json({ message: 'Announcement rejected', data: announcement });

    // Option B (if you want to delete): 
    // await Announcement.findByIdAndDelete(req.params.id);
    // res.json({ message: 'Announcement removed' });
  } catch (error) {
    console.error("❌ Error rejecting announcement:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 5️⃣ Delete Announcement (Admin can remove any announcement)
// Route: DELETE /api/admin/announcements/:id
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ error: 'Announcement not found' });

    // Delete the image from Cloudinary if exists
    if (announcement.imageUrl) {
      const publicId = announcement.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    console.error("❌ Error deleting announcement:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
