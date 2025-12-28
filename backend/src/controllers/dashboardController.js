import asyncHandler from '../middleware/asyncHandler.js';
import { sendResponse } from '../utils/ApiResponse.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Payment from '../models/Payment.js';

export const getDashboardStats = asyncHandler(async (req, res, next) => {
  const totalRevenue = await Payment.aggregate([
    { $match: { status: 'succeeded' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const activeRentals = await Order.countDocuments({
    status: { $in: ['confirmed', 'active'] }
  });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const newUsersThisMonth = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  });

  const popularProducts = await Order.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalOrders: { $sum: 1 },
        totalQuantity: { $sum: '$items.quantity' }
      }
    },
    { $sort: { totalOrders: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'productDetails'
      }
    },
    { $unwind: '$productDetails' }
  ]);

  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .populate('items.product', 'name')
    .sort('-createdAt')
    .limit(10);

  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: 'pending' });
  const completedOrders = await Order.countDocuments({ status: 'completed' });

  const monthlyRevenue = await Payment.aggregate([
    {
      $match: {
        status: 'succeeded',
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        revenue: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  sendResponse(res, 200, {
    revenue: {
      total: totalRevenue[0]?.total || 0,
      monthly: monthlyRevenue
    },
    orders: {
      total: totalOrders,
      active: activeRentals,
      pending: pendingOrders,
      completed: completedOrders
    },
    users: {
      newThisMonth: newUsersThisMonth
    },
    popularProducts,
    recentOrders
  }, 'Dashboard statistics retrieved successfully');
});
