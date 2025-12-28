import asyncHandler from '../middleware/asyncHandler.js';
import { ErrorResponse } from '../middleware/errorHandler.js';
import { sendResponse } from '../utils/ApiResponse.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import inventoryService from '../services/inventoryService.js';
import emailService from '../services/emailService.js';

export const createOrder = asyncHandler(async (req, res, next) => {
  const { items, rentalPeriod, shippingAddress, notes } = req.body;

  for (const item of items) {
    const availability = await inventoryService.checkAvailability(
      item.product,
      new Date(rentalPeriod.startDate),
      new Date(rentalPeriod.endDate),
      item.quantity
    );

    if (!availability.available) {
      return next(new ErrorResponse(availability.message, 400));
    }

    const product = await Product.findById(item.product);
    item.dailyRate = product.dailyRate;
    item.monthlyRate = product.monthlyRate;
  }

  const startDate = new Date(rentalPeriod.startDate);
  const endDate = new Date(rentalPeriod.endDate);
  const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  let totalAmount = 0;
  let totalDeposit = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);
    const rate = duration >= 30 ? product.monthlyRate : product.dailyRate;
    const itemTotal = rate * item.quantity * (duration >= 30 ? Math.ceil(duration / 30) : duration);
    totalAmount += itemTotal;
    totalDeposit += product.deposit * item.quantity;
  }

  const order = await Order.create({
    user: req.user.id,
    items,
    rentalPeriod,
    totalAmount,
    deposit: totalDeposit,
    shippingAddress,
    notes
  });

  await order.populate('items.product');
  await order.populate('user', 'name email');

  await emailService.sendOrderConfirmation(req.user, order);

  sendResponse(res, 201, { order }, 'Order created successfully');
});

export const getMyOrders = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ user: req.user.id })
    .populate('items.product')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments({ user: req.user.id });

  sendResponse(res, 200, {
    orders,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total
    }
  }, 'Orders retrieved successfully');
});

export const getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('items.product')
    .populate('user', 'name email phone');

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to access this order', 403));
  }

  sendResponse(res, 200, { order }, 'Order retrieved successfully');
});

export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return next(new ErrorResponse('Invalid status', 400));
  }

  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  order.status = status;
  await order.save();

  await emailService.sendOrderStatusUpdate(order.user, order);

  sendResponse(res, 200, { order }, 'Order status updated successfully');
});

export const getAllOrders = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }

  const orders = await Order.find(filter)
    .populate('user', 'name email phone')
    .populate('items.product')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(filter);

  sendResponse(res, 200, {
    orders,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total
    }
  }, 'All orders retrieved successfully');
});

export const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to cancel this order', 403));
  }

  if (order.status === 'completed' || order.status === 'cancelled') {
    return next(new ErrorResponse('Cannot cancel this order', 400));
  }

  order.status = 'cancelled';
  await order.save();

  sendResponse(res, 200, { order }, 'Order cancelled successfully');
});
