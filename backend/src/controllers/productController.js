import asyncHandler from '../middleware/asyncHandler.js';
import { ErrorResponse } from '../middleware/errorHandler.js';
import { sendResponse } from '../utils/ApiResponse.js';
import Product from '../models/Product.js';
import inventoryService from '../services/inventoryService.js';

export const getProducts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  if (req.query.minPrice || req.query.maxPrice) {
    filter.dailyRate = {};
    if (req.query.minPrice) filter.dailyRate.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.dailyRate.$lte = Number(req.query.maxPrice);
  }

  if (req.query.tags) {
    filter.tags = { $in: req.query.tags.split(',') };
  }

  filter.isAvailable = true;

  const sortBy = req.query.sort || '-createdAt';

  const products = await Product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(filter);

  sendResponse(res, 200, {
    products,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      hasMore: page * limit < total
    }
  }, 'Products retrieved successfully');
});

export const getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  sendResponse(res, 200, { product }, 'Product retrieved successfully');
});

export const createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body);

  sendResponse(res, 201, { product }, 'Product created successfully');
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  sendResponse(res, 200, { product }, 'Product updated successfully');
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  await product.deleteOne();

  sendResponse(res, 200, {}, 'Product deleted successfully');
});

export const checkAvailability = asyncHandler(async (req, res, next) => {
  const { startDate, endDate, quantity } = req.query;

  if (!startDate || !endDate) {
    return next(new ErrorResponse('Start date and end date are required', 400));
  }

  const result = await inventoryService.checkAvailability(
    req.params.id,
    new Date(startDate),
    new Date(endDate),
    parseInt(quantity) || 1
  );

  sendResponse(res, 200, result, 'Availability checked');
});
