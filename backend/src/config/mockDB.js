// In-memory database for testing
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const users = [];
let userIdCounter = 1;

const mockDB = {
  User: {
    create: async (userData) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = {
        _id: `user_${userIdCounter++}`,
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        phone: userData.phone,
        role: userData.role || 'customer',
        address: userData.address || {},
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      user.getSignedJwtToken = function() {
        return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE
        });
      };
      
      user.matchPassword = async function(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
      };
      
      user.toObject = function() {
        const obj = { ...this };
        delete obj.password;
        return obj;
      };
      
      users.push(user);
      return user;
    },
    
    findOne: async (query) => {
      if (!query.email) return null;
      
      const foundUser = users.find(u => u.email === query.email);
      if (!foundUser) return null;
      
      // Return user with all methods - password is always included
      const result = {
        _id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        password: foundUser.password,  // Always include password
        phone: foundUser.phone,
        role: foundUser.role,
        address: foundUser.address,
        isActive: foundUser.isActive,
        createdAt: foundUser.createdAt,
        updatedAt: foundUser.updatedAt
      };
      
      // Bind methods to result object
      result.matchPassword = foundUser.matchPassword.bind(result);
      result.getSignedJwtToken = foundUser.getSignedJwtToken.bind(result);
      result.toObject = foundUser.toObject.bind(result);
      
      return result;
    },
    
    findById: async (id) => {
      return users.find(u => u._id === id);
    }
  },
  
  Product: {
    find: async () => [],
    findById: async (id) => null,
    create: async (data) => ({ _id: 'product_1', ...data })
  },
  
  Order: {
    find: async () => [],
    findById: async (id) => null,
    create: async (data) => ({ _id: 'order_1', ...data })
  },
  
  Payment: {
    find: async () => [],
    findById: async (id) => null,
    create: async (data) => ({ _id: 'payment_1', ...data })
  }
};

export default mockDB;
