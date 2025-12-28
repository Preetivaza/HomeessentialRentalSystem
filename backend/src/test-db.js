import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

console.log('========================================');
console.log('Testing MongoDB Connection...');
console.log('========================================');
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`MongoDB URI: ${process.env.MONGO_URI?.replace(/\/\/.*@/, '//<credentials>@')}`);
console.log('========================================\n');

const testConnection = async () => {
  try {
    await connectDB();
    console.log('\n✅ SUCCESS: Database connection established!');
    console.log('========================================');
    console.log('Your backend is ready to use.');
    console.log('You can now start the server with: npm run dev');
    console.log('========================================\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ FAILED: Could not connect to database');
    console.error('Error:', error.message);
    console.log('\n📝 Make sure:');
    console.log('1. MongoDB is running (local or Atlas)');
    console.log('2. .env file exists with correct MONGO_URI');
    console.log('3. Network connection is available\n');
    process.exit(1);
  }
};

testConnection();
