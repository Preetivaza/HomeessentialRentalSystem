import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

// Resolve directory for .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const promoteToAdmin = async (email) => {
  if (!email) {
    console.error('Please provide an email address.');
    process.exit(1);
  }

  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`Searching for user with email: ${email}...`);
    const user = await User.findOne({ email });

    if (!user) {
      console.error('User not found.');
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();

    console.log('========================================');
    console.log(`✅ SUCCESS: ${user.name} (${email}) has been promoted to ADMIN.`);
    console.log('========================================');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Get email from command line argument
const emailArg = process.argv[2];
promoteToAdmin(emailArg);
