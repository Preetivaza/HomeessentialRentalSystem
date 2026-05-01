import Product from '../models/Product.js';
import User from '../models/User.js';

const MINIMAL_CORE_PRODUCTS = [
  {
    name: 'Cloud Modular Sofa',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'],
    category: 'furniture',
    description: 'Ultra-soft modular sofa designed for maximum comfort and flexibility.',
    pricePerDay: 110,
    securityDeposit: 2000,
    stock: 5,
    condition: 'new',
    specifications: { material: 'Velvet', capacity: '3-Seater' }
  },
  {
    name: 'Infinity 4K Smart TV',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800'],
    category: 'electronics',
    description: 'Crystal-clear 4K resolution with built-in smart streaming apps.',
    pricePerDay: 80,
    securityDeposit: 3000,
    stock: 6,
    condition: 'new',
    specifications: { size: '55 inch', resolution: '4K Ultra HD' }
  },
  {
    name: 'Pro Treadmill X1',
    images: ['https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800'],
    category: 'fitness',
    description: 'Commercial-grade folding treadmill with heart rate monitoring.',
    pricePerDay: 150,
    securityDeposit: 5000,
    stock: 2,
    condition: 'new',
    specifications: { max_speed: '20km/h', incline: 'Automatic' }
  },
  {
    name: 'PureSteel Fridge',
    images: ['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800'],
    category: 'appliances',
    description: 'Advanced cooling technology with a premium stainless steel finish.',
    pricePerDay: 90,
    securityDeposit: 3000,
    stock: 4,
    condition: 'new',
    specifications: { capacity: '450L', type: 'Double Door' }
  }
];

export const seedInitialStaticProducts = async () => {
  try {
    const productCount = await Product.countDocuments();
    
    // ONLY seed if the database is completely empty
    if (productCount === 0) {
      console.log('Database is empty. Seeding minimal core products...');
      await Product.insertMany(MINIMAL_CORE_PRODUCTS);
      console.log(`Successfully seeded ${MINIMAL_CORE_PRODUCTS.length} core products.`);
    } else {
      console.log(`Inventory already contains ${productCount} products. Skipping auto-seed.`);
    }

    // Still ensure the primary test user is an admin for dashboard development
    const adminEmail = 'testuser@example.com';
    const user = await User.findOne({ email: adminEmail });
    if (user && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
      console.log(`Verified Admin status for ${adminEmail}`);
    }

  } catch (error) {
    console.error('Seeding Error:', error);
  }
};
