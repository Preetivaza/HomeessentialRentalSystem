import mongoose from 'mongoose';
import asyncHandler from '../middleware/asyncHandler.js';
import { ErrorResponse } from '../middleware/errorHandler.js';
import { sendResponse } from '../utils/ApiResponse.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import inventoryService from '../services/inventoryService.js';
import emailService from '../services/emailService.js';
import { calculateRentalCost } from '../utils/pricingEngine.js';

// @desc    Create new order with transaction and concurrency control
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res, next) => {
  const { items, shippingAddress, notes, bundleId } = req.body;
  const idempotencyKey = req.headers['x-idempotency-key'];

  // 1. Idempotency Check
  if (idempotencyKey) {
    const existingOrder = await Order.findOne({ idempotencyKey });
    if (existingOrder) {
      return sendResponse(res, 200, { order: existingOrder }, 'Order already processed (Idempotent)');
    }
  }

  // 2. Start Session for Transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const enrichedItems = [];
    let totalAmount = 0;
    let totalDeposit = 0;

    // 3. Concurrency-Safe Availability Check & Data Gathering
    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        throw new ErrorResponse(`Product not found`, 404);
      }

      // Calculate logic dynamically on backend
      const costDetails = calculateRentalCost(product, item.startDate, item.endDate, item.quantity);

      const availability = await inventoryService.checkAvailability(
        item.productId,
        new Date(item.startDate),
        new Date(item.endDate),
        item.quantity,
        session
      );

      if (!availability.available) {
        throw new ErrorResponse(availability.message, 400);
      }

      totalAmount += costDetails.total;
      totalDeposit += costDetails.deposit;

      // Update product's strict availability counters immediately for booking safety
      product.reserved += item.quantity;
      product.bookedRanges.push({
        startDate: new Date(item.startDate),
        endDate: new Date(item.endDate)
      });
      await product.save({ session, validateBeforeSave: false });

      enrichedItems.push({
        productId: item.productId,
        name: product.name,
        quantity: item.quantity,
        pricePerDay: product.pricePerDay,
        securityDeposit: product.securityDeposit,
        startDate: new Date(item.startDate),
        endDate: new Date(item.endDate),
        duration: costDetails.duration,
        baseRent: costDetails.baseRent,
        deposit: costDetails.deposit,
        tax: costDetails.tax,
        total: costDetails.total
      });
    }

    // 4. Calculate optional insurance on total contract value
    const insuranceOpted = req.body.insuranceOpted === true;
    const insuranceAmount = insuranceOpted ? Math.round(totalAmount * 0.05 * 100) / 100 : 0;

    // 5. Create the Order within Transaction
    const orderData = {
      user: req.user.id,
      items: enrichedItems,
      totalAmount: totalAmount + insuranceAmount,
      securityDeposit: totalDeposit,
      insurance: {
        opted: insuranceOpted,
        amount: insuranceAmount
      },
      logistics: {
        deliverySlot: req.body.deliverySlot, // expects { date, timeWindow }
        status: 'pending'
      },
      shippingAddress,
      notes,
      idempotencyKey,
      bundle: bundleId
    };

    const orders = await Order.create([orderData], { session });
    const order = orders[0];

    // 5. Commit Transaction
    await session.commitTransaction();
    session.endSession();

    // 6. Post-processing (non-critical tasks)
    await order.populate('items.productId');
    await order.populate('user', 'name email');

    try {
      await emailService.sendOrderConfirmation(req.user, order);
    } catch (emailErr) {
      console.error('Email confirmation failed:', emailErr.message);
    }

    sendResponse(res, 201, { order }, 'Order created successfully');

  } catch (error) {
    // 7. Abort Transaction on failure
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ user: req.user.id })
    .populate('items.productId')
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

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('items.productId')
    .populate('user', 'name email phone');

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to access this order', 403));
  }

  sendResponse(res, 200, { order }, 'Order retrieved successfully');
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
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

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
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
    .populate('items.productId')
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

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
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
