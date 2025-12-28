import mongoose from 'mongoose';

const connectDB = async () => {
  console.log('========================================');
  console.log('⚠️  Using IN-MEMORY Database (Testing Mode)');
  console.log('========================================');
  console.log('MongoDB Atlas connection disabled');
  console.log('Data will be stored in memory only');
  console.log('========================================');
  
  // Skip MongoDB connection for now
  return null;
};

export default connectDB;


