// server/seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Load Models
import User from './models/User.js';
import SDG from './models/SDG.js';

// Load Sample Data
// import sampleUsers from './data/sampleUsers.js'; // Uncomment if you have sample users to seed
import sampleSDGs from './data/sdgData.js'; // Ensure this path is correct and file exists

dotenv.config({ path: './server/.env' });

const importData = async () => {
  try {
    await connectDB();

    // Clear only SDG data before importing
    await SDG.deleteMany();
    console.log('Existing SDG data cleared.');

    // Insert new SDG data
    await SDG.insertMany(sampleSDGs);
    console.log('Sample SDG data imported successfully!');

    // Optional: If you also want to seed users during this import, uncomment these lines
    // console.log('Clearing existing User data...');
    // await User.deleteMany();
    // console.log('Importing sample User data...');
    // await User.insertMany(sampleUsers); // Make sure sampleUsers.js exists and is populated
    // console.log('Sample User data imported successfully!');
    
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    // This function can be used to clear all specified collections
    await User.deleteMany();
    await SDG.deleteMany();
    // Add any other models you want to clear, e.g., UserProgress.deleteMany()
    // await UserProgress.deleteMany(); 

    console.log('All specified data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

// Command line argument processing
if (process.argv[2] === '-d' || process.argv[2] === '--destroy') {
  console.log('Destroying data...');
  destroyData();
} else if (process.argv[2] === '-i' || process.argv[2] === '--import') {
  console.log('Importing data...');
  importData();
} else {
  console.log(`
  Usage: node server/seeder.js [option]
  Options:
    -i, --import    Import sample SDG data (clears existing SDGs only by default)
    -d, --destroy   Destroy data in specified collections (Users, SDGs, etc.)
  `);
  process.exit();
}