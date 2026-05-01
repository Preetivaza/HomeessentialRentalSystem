import asyncHandler from '../middleware/asyncHandler.js';
import { sendResponse } from '../utils/ApiResponse.js';
import emailService from '../services/emailService.js';
import orderService from '../services/orderService.js';

// @desc    Create new order with transaction and concurrency control
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res, next) => {
  const { items, shippingAddress, notes, bundleId } = req.body;
  const idempotencyKey = req.headers['x-idempotency-key'];
  const insuranceOpted = req.body.insuranceOpted === true;

  // 1. Idempotency Check
  if (idempotencyKey) {
    const existingOrder = await orderService.findByIdempotencyKey(idempotencyKey);
    if (existingOrder) {
      return sendResponse(res, 200, { order: existingOrder }, 'Order already processed (Idempotent)');
    }
  }

  // 2. Delegate to Service Layer
  const order = await orderService.processCheckoutTransaction(
    req.user.id,
    items,
    shippingAddress,
    notes,
    bundleId,
    idempotencyKey,
    insuranceOpted
  );

  // 3. Post-processing (non-critical tasks)
  await order.populate('items.productId');
  await order.populate('user', 'name email');

  try {
    await emailService.sendOrderConfirmation(req.user, order);
  } catch (emailErr) {
    console.error('Email confirmation failed:', emailErr.message);
  }

  sendResponse(res, 201, { order }, 'Order created successfully');
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res, next) => {
  const result = await orderService.getUserOrders(req.user.id, req.query);
  sendResponse(res, 200, result, 'Orders retrieved successfully');
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = asyncHandler(async (req, res, next) => {
  const order = await orderService.getOrderByIdForRequester(req.params.id, req.user);
  sendResponse(res, 200, { order }, 'Order retrieved successfully');
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const order = await orderService.updateOrderStatus(req.params.id, status);

  await emailService.sendOrderStatusUpdate(order.user, order);

  sendResponse(res, 200, { order }, 'Order status updated successfully');
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res, next) => {
  const result = await orderService.listOrders(req.query);
  sendResponse(res, 200, result, 'All orders retrieved successfully');
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await orderService.cancelOrder(req.params.id, req.user);
  sendResponse(res, 200, { order }, 'Order cancelled successfully');
});
