const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Announcement = require('../models/Announcement');
const { cloudinary } = require('../utils/cloudinary');

dotenv.config();
console.log("Mongo URI:", process.env.MONGO_URI); 

// Function to upload local image to Cloudinary
const uploadLocalImage = async (imagePath, folder) => {
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString('base64');
  const uploadResponse = await cloudinary.uploader.upload(
    `data:image/jpeg;base64,${base64Image}`,
    { folder }
  );
  return uploadResponse;
};

const seedAnnouncements = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    // Delete existing announcements
    await Announcement.deleteMany({});
    console.log('Cleared existing announcements');

    console.log("Cloudinary Keys:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Upload event images from local folder to Cloudinary
    // Assumption: Images are stored in the "data" folder in the project root
    const eventImageResponses = [];
    for (let i = 1; i <= 4; i++) {
      const imagePath = path.join(__dirname, `../data/event${i}.jpg`);
      const response = await uploadLocalImage(imagePath, 'announcements/events');
      eventImageResponses.push(response);
    }

    // Upload achievement images to Cloudinary
    const achievementImageResponses = [];
    for (let i = 1; i <= 5; i++) {
      const imagePath = path.join(__dirname, `../data/achievement${i}.jpg`);
      const response = await uploadLocalImage(imagePath, 'announcements/achievements');
      achievementImageResponses.push(response);
    }

    // Define sample events with date/time & venue
    const events = [
      {
        name: "Abhivyakti",
        type: 'event',
        title: 'Abhivyakti - Annual Cultural Fest',
        description: 'Experience a vibrant cultural extravaganza showcasing music, dance, drama, and art!',
        imageUrl: eventImageResponses[0].secure_url,
        status: 'approved',
        // New fields:
        eventDateTime: new Date('2025-03-10T15:30:00Z'),
        venue: 'Amphitheatre',
      },
      {
        name: "Tantrafiesta",
        type: 'event',
        title: 'Tantrafiesta - Annual Tech Fest',
        description: 'Participate in a showcase of tech innovations, hackathons, and workshops led by industry experts!',
        imageUrl: eventImageResponses[1].secure_url,
        status: 'approved',
        eventDateTime: new Date('2025-03-15T14:00:00Z'),
        venue: 'Stage Area',
      },
      {
        name: "E-summit",
        type: 'event',
        title: 'E-summit - Digital Innovation Summit',
        description: 'Join us for insightful talks and networking with industry leaders in digital innovation.',
        imageUrl: eventImageResponses[2].secure_url,
        status: 'approved',
        eventDateTime: new Date('2025-03-20T10:00:00Z'),
        venue: 'Academic',
      },
      {
        name: "Kshitij",
        type: 'event',
        title: 'Kshitij - Annual Sports Fest',
        description: 'Compete and celebrate at our annual sports fest with a variety of games and events.',
        imageUrl: eventImageResponses[3].secure_url,
        status: 'approved',
        eventDateTime: new Date('2025-03-25T17:00:00Z'),
        venue: 'Amphitheatre',
      }
    ];

    // Define sample achievements
    const achievements = [
      {
        name: "Rahul Sharma",
        type: 'achievement',
        title: 'Best Innovator Award',
        description: 'Won the Best Innovator Award in AI at the National Technology Summit.',
        imageUrl: achievementImageResponses[0].secure_url,
      },
      {
        name: "Priya Patel",
        type: 'achievement',
        title: 'Research Publication',
        description: 'Published a paper in IEEE on advanced machine learning algorithms.',
        imageUrl: achievementImageResponses[1].secure_url,
      },
      {
        name: "Amit Kumar",
        type: 'achievement',
        title: 'Startup Success',
        description: 'Raised $2 million in seed funding for his education technology startup.',
        imageUrl: achievementImageResponses[2].secure_url,
      },
      {
        name: "Vasu Parashar",
        type: 'achievement',
        title: 'International Scholarship',
        description: 'Received a full scholarship to pursue PhD at MIT.',
        imageUrl: achievementImageResponses[3].secure_url,
      },
      {
        name: "Nayan Mandal",
        type: 'achievement',
        title: 'Coding Competition Winner',
        description: 'Secured first place in the International Coding Olympiad.',
        imageUrl: achievementImageResponses[4].secure_url,
      },
    ];

    // Combine events and achievements
    const announcements = [...events, ...achievements];

    // Insert into DB
    const createdAnnouncements = await Announcement.create(announcements);
    console.log(`Created ${createdAnnouncements.length} announcements`);

    // Close DB connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding announcements:', error);
    process.exit(1);
  }
};

seedAnnouncements();
