const mongoose = require('mongoose');

async function main() {
  await mongoose.connect('mongodb+srv://sarfaraz_db_user:mD93VARAJHUVpNkX@cluster0.nkgdh6e.mongodb.net/?appName=Cluster0');
  
  try {
    await mongoose.connection.collection('users').dropIndex('username_1');
    console.log('Dropped username_1 index');
  } catch (err) {
    console.log('Error dropping index', err);
  }
  
  process.exit(0);
}
main().catch(console.error);
