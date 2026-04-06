const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: path.join(__dirname, '.env') });

async function main() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined. Add it to server/.env before running this script.');
  }

  await mongoose.connect(mongoUri);

  try {
    await mongoose.connection.collection('users').dropIndex('username_1');
    console.log('Dropped username_1 index');
  } catch (err) {
    console.log('Error dropping index', err);
  } finally {
    await mongoose.connection.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
