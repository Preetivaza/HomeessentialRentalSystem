import Product from '../models/Product.js';
import { ErrorResponse } from '../middleware/errorHandler.js';
import inventoryService from './inventoryService.js';
import pricingService from './pricingService.js';

class ProductService {
  async listProducts(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (query.category) filter.category = query.category;
    if (query.search) filter.$text = { $search: query.search };

    if (query.minPrice || query.maxPrice) {
      filter.pricePerDay = {};
      if (query.minPrice) filter.pricePerDay.$gte = Number(query.minPrice);
      if (query.maxPrice) filter.pricePerDay.$lte = Number(query.maxPrice);
    }

    if (query.tags) {
      filter.tags = { $in: String(query.tags).split(',') };
    }

    filter.isAvailable = true;
    const sortBy = query.sort || '-createdAt';

    const products = await Product.find(filter).sort(sortBy).skip(skip).limit(limit).lean();
    const total = await Product.countDocuments(filter);

    return {
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasMore: page * limit < total,
      },
    };
  }

  async getProductById(id) {
    const product = await Product.findById(id).lean();
    if (!product) {
      throw new ErrorResponse('Product not found', 404);
    }
    return product;
  }

  async createProduct(data) {
    return await Product.create(data);
  }

  async updateProduct(id, data) {
    const existing = await Product.findById(id);
    if (!existing) {
      throw new ErrorResponse('Product not found', 404);
    }

    return await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async deleteProduct(id) {
    const product = await Product.findById(id);
    if (!product) {
      throw new ErrorResponse('Product not found', 404);
    }
    await product.deleteOne();
  }

  async calculateProductRental(id, { startDate, endDate, quantity }) {
    const product = await Product.findById(id).lean();
    
    if (!product) {
      throw new ErrorResponse('Product not found', 404);
    }

    // 1. Initial Logic Validations
    const today = new Date();
    today.setHours(0,0,0,0);
    const requestedStart = new Date(startDate);
    requestedStart.setHours(0,0,0,0);

    if (requestedStart < today) {
      throw new ErrorResponse('Rental cannot start in the past', 400);
    }

    if (quantity > product.stock) {
      throw new ErrorResponse(`Only ${product.stock} units available in total stock`, 400);
    }

    // 2. Perform Cost Calculation (Rules Logic)
    const costDetails = pricingService.calculateRentalCost(product, startDate, endDate, quantity);

    // 3. Perform Availability Check (Inventory Logic)
    const availability = await inventoryService.checkAvailability(
      id,
      new Date(startDate),
      new Date(endDate),
      quantity
    );

    if (!availability.available) {
      throw new ErrorResponse(availability.message, 400);
    }

    return {
      ...costDetails,
      isAvailable: true
    };
  }
}

export default new ProductService();
