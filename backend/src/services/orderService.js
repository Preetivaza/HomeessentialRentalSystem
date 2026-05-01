import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import inventoryService from './inventoryService.js';
import { ErrorResponse } from '../middleware/errorHandler.js';
import pricingService from './pricingService.js';

class OrderService {
  async findByIdempotencyKey(idempotencyKey) {
    if (!idempotencyKey) return null;
    return await Order.findOne({ idempotencyKey });
  }

  /**
   * Process a full checkout transaction encapsulating calculations, limits, and inventory.
   */
  async processCheckoutTransaction(userId, items, shippingAddress, notes, bundleId, idempotencyKey, insuranceOpted) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const enrichedItems = [];
      let totalAmount = 0;
      let totalDeposit = 0;

      for (const item of items) {
        const product = await Product.findById(item.productId).session(session);
        if (!product) {
          throw new ErrorResponse(`Product not found`, 404);
        }

        const costDetails = pricingService.calculateRentalCost(product, item.startDate, item.endDate, item.quantity);

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

      const insuranceAmount = pricingService.calculateInsuranceAmount(totalAmount, insuranceOpted);

      const orderData = {
        user: userId,
        items: enrichedItems,
        totalAmount: totalAmount + insuranceAmount,
        securityDeposit: totalDeposit,
        insurance: {
          opted: insuranceOpted,
          amount: insuranceAmount
        },
        logistics: {
          status: 'pending'
        },
        shippingAddress,
        notes,
        idempotencyKey,
        bundle: bundleId
      };

      const orders = await Order.create([orderData], { session });
      const order = orders[0];

      await session.commitTransaction();
      session.endSession();

      return order;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      if (error instanceof ErrorResponse) {
        throw error;
      }
      throw new ErrorResponse(error?.message || 'Checkout transaction failed', 500);
    }
  }

  async getUserOrders(userId, query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: userId })
      .populate('items.productId')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ user: userId });

    return {
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
      },
    };
  }

  async getOrderByIdForRequester(orderId, requester) {
    const order = await Order.findById(orderId)
      .populate('items.productId')
      .populate('user', 'name email phone');

    if (!order) {
      throw new ErrorResponse('Order not found', 404);
    }

    if (order.user._id.toString() !== requester.id && requester.role !== 'admin') {
      throw new ErrorResponse('Not authorized to access this order', 403);
    }

    return order;
  }

  async listOrders(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (query.status) filter.status = query.status;

    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .populate('items.productId')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    return {
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
      },
    };
  }

  async updateOrderStatus(orderId, status) {
    const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new ErrorResponse('Invalid status', 400);
    }

    const order = await Order.findById(orderId).populate('user', 'name email');
    if (!order) {
      throw new ErrorResponse('Order not found', 404);
    }

    order.status = status;
    await order.save();
    return order;
  }

  async cancelOrder(orderId, requester) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new ErrorResponse('Order not found', 404);
    }

    if (order.user.toString() !== requester.id && requester.role !== 'admin') {
      throw new ErrorResponse('Not authorized to cancel this order', 403);
    }

    if (order.status === 'completed' || order.status === 'cancelled') {
      throw new ErrorResponse('Cannot cancel this order', 400);
    }

    order.status = 'cancelled';
    await order.save();
    return order;
  }
}

export default new OrderService();
