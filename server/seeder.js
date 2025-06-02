// server/seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // Assuming your DB connection logic is here

// Load Models
import User from './models/User.js'; // If you want to seed users
import SDG from './models/SDG.js';

// Load Sample Data
import sampleUsers from './data/sampleUsers.js'; // Optional: create this file if seeding users
import sampleSDGs from './data/sampleSDGs.js';

dotenv.config({ path: './server/.env' }); // Ensure correct path to .env from project root perspective if run from root

const importData = async () => {
  try {
    await connectDB(); // Connect to DB

    // Clear existing data
    await User.deleteMany(); // Optional: clear users
    await SDG.deleteMany();
    console.log('Existing data cleared.');

    // Insert new data
    // const createdUsers = await User.insertMany(sampleUsers); // Optional
    const createdSDGs = await SDG.insertMany(sampleSDGs);
    console.log('Sample data imported successfully!');
    
    // const adminUser = createdUsers[0]._id; // Example if you have an admin user in sampleUsers

    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB(); // Connect to DB

    await User.deleteMany(); // Optional
    await SDG.deleteMany();

    console.log('Data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

// Command line argument processing
if (process.argv[2] === '-d' || process.argv[2] === '--destroy') {
  destroyData();
} else if (process.argv[2] === '-i' || process.argv[2] === '--import') {
  importData();
} else {
  console.log(`
  Usage: node server/seeder.js [option]
  Options:
    -i, --import    Import sample data into the database
    -d, --destroy   Destroy all data in specified collections
  `);
  process.exit();
}