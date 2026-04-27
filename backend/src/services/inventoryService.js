import Order from '../models/Order.js';
import Product from '../models/Product.js';

const inventoryService = {
  /**
   * Check if a product is available for a given date range and quantity
   * @param {string} productId - ID of the product
   * @param {Date} startDate - Start date of rental
   * @param {Date} endDate - End date of rental
   * @param {number} quantity - Number of items requested
   * @param {Object} session - Mongoose session for transaction
   */
  checkAvailability: async (productId, startDate, endDate, quantity = 1, session = null) => {
    const query = Product.findById(productId);
    if (session) query.session(session);
    
    const product = await query;
    
    if (!product) {
      return { available: false, message: 'Product not found' };
    }

    if (product.stock < quantity) {
      return { available: false, message: 'Insufficient base stock' };
    }

    // 1. Check if the dates overlap with any globally booked ranges
    const overlaps = product.bookedRanges && product.bookedRanges.some(range => {
      const rangeStart = new Date(range.startDate);
      const rangeEnd = new Date(range.endDate);
      return startDate <= rangeEnd && endDate >= rangeStart;
    });

    if (overlaps) {
      return { available: false, message: 'Selected dates are unavailable due to existing reservations.' };
    }

    // 2. Check stock vs reserved globally
    const reservedCount = product.reserved || 0;
    const maintenanceCount = product.inMaintenanceCount || 0;
    const availableStock = product.stock - reservedCount - maintenanceCount;

    if (availableStock < quantity) {
      return { 
        available: false, 
        message: `Only ${availableStock} units available for selected dates`,
        availableStock 
      };
    }

    return { available: true, availableStock };
  },

  /**
   * Update product stock (permanent reduction/increase)
   */
  updateProductStock: async (productId, quantity, operation = 'decrease', session = null) => {
    const update = operation === 'decrease' 
      ? { $inc: { stock: -quantity } }
      : { $inc: { stock: quantity } };
    
    const query = Product.findByIdAndUpdate(
      productId,
      update,
      { new: true, runValidators: true }
    );
    
    if (session) query.session(session);
    
    const product = await query;
    return product;
  }
};

export default inventoryService;
