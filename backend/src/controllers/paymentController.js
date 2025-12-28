import asyncHandler from '../middleware/asyncHandler.js';
import { ErrorResponse } from '../middleware/errorHandler.js';
import { sendResponse } from '../utils/ApiResponse.js';
import stripe from '../config/stripe.js';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';

export const createPaymentIntent = asyncHandler(async (req, res, next) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  if (order.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  if (order.paymentStatus === 'paid') {
    return next(new ErrorResponse('Order already paid', 400));
  }

  const amount = Math.round((order.totalAmount + order.deposit) * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'inr',
    metadata: {
      orderId: order._id.toString(),
      userId: req.user.id
    }
  });

  const payment = await Payment.create({
    order: orderId,
    user: req.user.id,
    stripePaymentIntentId: paymentIntent.id,
    amount: order.totalAmount + order.deposit,
    status: 'pending'
  });

  sendResponse(res, 200, {
    clientSecret: paymentIntent.client_secret,
    paymentId: payment._id
  }, 'Payment intent created');
});

export const handleWebhook = asyncHandler(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return next(new ErrorResponse(`Webhook Error: ${err.message}`, 400));
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;

    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntent.id
    });

    if (payment) {
      payment.status = 'succeeded';
      await payment.save();

      const order = await Order.findById(payment.order);
      if (order) {
        order.paymentStatus = 'paid';
        order.status = 'confirmed';
        await order.save();
      }
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;

    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntent.id
    });

    if (payment) {
      payment.status = 'failed';
      await payment.save();

      const order = await Order.findById(payment.order);
      if (order) {
        order.paymentStatus = 'failed';
        await order.save();
      }
    }
  }

  res.json({ received: true });
});

export const getPaymentStatus = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id)
    .populate('order')
    .populate('user', 'name email');

  if (!payment) {
    return next(new ErrorResponse('Payment not found', 404));
  }

  if (payment.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized', 403));
  }

  sendResponse(res, 200, { payment }, 'Payment status retrieved');
});

export const refundPayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return next(new ErrorResponse('Payment not found', 404));
  }

  if (payment.status !== 'succeeded') {
    return next(new ErrorResponse('Payment cannot be refunded', 400));
  }

  const refund = await stripe.refunds.create({
    payment_intent: payment.stripePaymentIntentId
  });

  payment.status = 'refunded';
  await payment.save();

  const order = await Order.findById(payment.order);
  if (order) {
    order.paymentStatus = 'refunded';
    order.status = 'cancelled';
    await order.save();
  }

  sendResponse(res, 200, { refund, payment }, 'Payment refunded successfully');
});
