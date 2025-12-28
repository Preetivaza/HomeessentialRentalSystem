import Order from '../models/Order.js';
import Product from '../models/Product.js';

const inventoryService = {
  checkAvailability: async (productId, startDate, endDate, quantity = 1) => {
    const product = await Product.findById(productId);
    
    if (!product) {
      return { available: false, message: 'Product not found' };
    }

    if (product.stock < quantity) {
      return { available: false, message: 'Insufficient stock' };
    }

    const overlappingOrders = await Order.find({
      'items.product': productId,
      status: { $in: ['confirmed', 'active'] },
      $or: [
        {
          'rentalPeriod.startDate': { $lte: endDate },
          'rentalPeriod.endDate': { $gte: startDate }
        }
      ]
    });

    const reservedQuantity = overlappingOrders.reduce((total, order) => {
      const item = order.items.find(i => i.product.toString() === productId.toString());
      return total + (item ? item.quantity : 0);
    }, 0);

    const availableStock = product.stock - reservedQuantity;

    if (availableStock < quantity) {
      return { 
        available: false, 
        message: `Only ${availableStock} units available for selected dates`,
        availableStock 
      };
    }

    return { available: true, availableStock };
  },

  reserveStock: async (productId, quantity) => {
    const product = await Product.findById(productId);
    
    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    // Note: In production, you might want to implement a reservation system
    // rather than immediately reducing stock
    return true;
  },

  releaseStock: async (productId, quantity) => {
    // Release reserved stock when order is cancelled/completed
    return true;
  },

  updateProductStock: async (productId, quantity, operation = 'decrease') => {
    const update = operation === 'decrease' 
      ? { $inc: { stock: -quantity } }
      : { $inc: { stock: quantity } };
    
    const product = await Product.findByIdAndUpdate(
      productId,
      update,
      { new: true, runValidators: true }
    );

    return product;
  }
};

export default inventoryService;
