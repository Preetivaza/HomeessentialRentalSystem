import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log('========================================');
    console.log(` MongoDB Connected: ${conn.connection.host}`);
    console.log('========================================');
  } catch (error) {
    console.error('========================================');
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Check your .env file and MongoDB Atlas access.');
    console.log('========================================');
    process.exit(1);
  }
};

export default connectDB;
