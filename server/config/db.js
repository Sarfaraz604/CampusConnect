// server/config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/users');

dotenv.config();

const normalizeLegacyAdmins = async () => {
  const result = await User.updateMany(
    {
      role: 'admin',
      $or: [
        { branch: { $ne: 'Administration' } },
        { branchCode: { $ne: 'ADM' } },
        { batch: { $exists: false } },
        { batch: null },
        { batch: '' }
      ]
    },
    {
      $set: {
        branch: 'Administration',
        branchCode: 'ADM',
        batch: 'N/A'
      }
    }
  );

  if (result.modifiedCount > 0) {
    console.log(`Normalized ${result.modifiedCount} legacy admin account(s)`);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await normalizeLegacyAdmins();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
