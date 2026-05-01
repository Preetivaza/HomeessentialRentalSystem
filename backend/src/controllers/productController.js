import asyncHandler from '../middleware/asyncHandler.js';
import { sendResponse } from '../utils/ApiResponse.js';
import inventoryService from '../services/inventoryService.js';
import productService from '../services/productService.js';

export const getProducts = asyncHandler(async (req, res, next) => {
  const result = await productService.listProducts(req.query);
  sendResponse(res, 200, result, 'Products retrieved successfully');
});

export const getProduct = asyncHandler(async (req, res, next) => {
  const product = await productService.getProductById(req.params.id);
  sendResponse(res, 200, { product }, 'Product retrieved successfully');
});

export const createProduct = asyncHandler(async (req, res, next) => {
  const product = await productService.createProduct(req.body);
  sendResponse(res, 201, { product }, 'Product created successfully');
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  sendResponse(res, 200, { product }, 'Product updated successfully');
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  await productService.deleteProduct(req.params.id);
  sendResponse(res, 200, {}, 'Product deleted successfully');
});

export const checkAvailability = asyncHandler(async (req, res, next) => {
  const { startDate, endDate, quantity } = req.query;

  const result = await inventoryService.checkAvailability(
    req.params.id,
    new Date(startDate),
    new Date(endDate),
    parseInt(quantity) || 1
  );

  sendResponse(res, 200, result, 'Availability checked');
});

export const calculateCost = asyncHandler(async (req, res, next) => {
  const { startDate, endDate, quantity } = req.body;

  const calculation = await productService.calculateProductRental(req.params.id, {
    startDate,
    endDate,
    quantity: parseInt(quantity) || 1
  });

  sendResponse(res, 200, calculation, 'Cost calculated successfully');
});
