import mongoose from 'mongoose';
import Product from '../models/Product.js';
import User from '../models/User.js';

export const seedInitialStaticProducts = async () => {
  try {
    const existingCount = await Product.countDocuments();
    if (existingCount === 0) {
      console.log('🌱 Seeding initial products from static data...');
      
      const staticProducts = [
        { 
          name: 'Cloud Modular Sofa', 
          images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'], 
          category: 'furniture', 
          isAvailable: true,
          description: 'Ultra-soft modular sofa designed for maximum comfort and flexibility.',
          pricePerDay: 15,
          securityDeposit: 150,
          lateFeePerDay: 5,
          minRentalDays: 1,
          maxRentalDays: 365,
          stock: 5,
          reserved: 0,
          bookedRanges: []
        },
        { 
          name: 'Walnut Minimal Table', 
          images: ['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800'], 
          category: 'furniture', 
          isAvailable: true,
          description: 'Sleek walnut wood table perfect for modern dining spaces.',
          pricePerDay: 10,
          securityDeposit: 100,
          lateFeePerDay: 5,
          minRentalDays: 1,
          maxRentalDays: 365,
          stock: 8,
          reserved: 0,
          bookedRanges: []
        },
        { 
          name: 'Echo Steam Washer', 
          images: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800'], 
          category: 'appliances', 
          isAvailable: false,
          description: 'High-efficiency steam washer with smart cleaning technology.',
          pricePerDay: 8,
          securityDeposit: 100,
          lateFeePerDay: 5,
          minRentalDays: 1,
          maxRentalDays: 365,
          stock: 0,
          reserved: 0,
          bookedRanges: []
        },
        { 
          name: 'Velvet King Bed', 
          images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800'], 
          category: 'furniture', 
          isAvailable: true,
          description: 'Luxurious velvet-upholstered king-size bed frame.',
          pricePerDay: 12,
          securityDeposit: 150,
          lateFeePerDay: 5,
          minRentalDays: 1,
          maxRentalDays: 365,
          stock: 3,
          reserved: 0,
          bookedRanges: []
        },
        { 
          name: 'PureSteel Fridge', 
          images: ['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800'], 
          category: 'appliances', 
          isAvailable: true,
          description: 'Advanced cooling technology with a premium stainless steel finish.',
          pricePerDay: 9,
          securityDeposit: 120,
          lateFeePerDay: 5,
          minRentalDays: 1,
          maxRentalDays: 365,
          stock: 4,
          reserved: 0,
          bookedRanges: []
        },
        { 
          name: 'Zen Office Desk', 
          images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800'], 
          category: 'furniture', 
          isAvailable: true,
          description: 'Ergonomic office desk focus on productivity and minimalism.',
          pricePerDay: 7,
          securityDeposit: 80,
          lateFeePerDay: 5,
          minRentalDays: 1,
          maxRentalDays: 365,
          stock: 10,
          reserved: 0,
          bookedRanges: []
        },
        { 
          name: 'Infinity 4K Smart TV', 
          images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800'], 
          category: 'electronics', 
          isAvailable: true,
          description: 'Crystal-clear 4K resolution with built-in smart streaming apps.',
          pricePerDay: 10,
          securityDeposit: 100,
          lateFeePerDay: 5,
          minRentalDays: 1,
          maxRentalDays: 365,
          stock: 6,
          reserved: 0,
          bookedRanges: []
        },
        { 
          name: 'Nano Microwave', 
          images: ['https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800'], 
          category: 'appliances', // mapped Kitchen to appliances
          isAvailable: true,
          description: 'Compact yet powerful microwave for quick and easy meal prep.',
          pricePerDay: 5,
          securityDeposit: 50,
          lateFeePerDay: 5,
          minRentalDays: 1,
          maxRentalDays: 365,
          stock: 15,
          reserved: 0,
          bookedRanges: []
        }
      ];

      await Product.insertMany(staticProducts);
      console.log('✅ Initial products successfully migrated to MongoDB!');
    }

    // Auto-promote testuser@example.com to Admin
    const user = await User.findOne({ email: 'testuser@example.com' });
    if (user && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
      console.log('✅ Temporary Fix: Elevated testuser@example.com to Admin.');
    }
  } catch (error) {
    console.error('Seeding Error:', error);
  }
};
