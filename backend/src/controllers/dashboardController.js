import asyncHandler from '../middleware/asyncHandler.js';
import { sendResponse } from '../utils/ApiResponse.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Payment from '../models/Payment.js';

// @desc    Get comprehensive dashboard analytics for Admins
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res, next) => {
  // 1. Revenue Analytics (Aggregated)
  const totalRevenue = await Payment.aggregate([
    { $match: { status: 'succeeded' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  // 2. Inventory Utilization Calculation
  // Total units out on rent vs total units in warehouse
  const totalStockData = await Product.aggregate([
    { $group: { _id: null, total: { $sum: '$stock' }, inRepair: { $sum: '$inMaintenanceCount' } } }
  ]);
  const totalStock = totalStockData[0]?.total || 0;
  const totalInRepair = totalStockData[0]?.inRepair || 0;

  const activeOrdersItems = await Order.aggregate([
    { $match: { status: { $in: ['confirmed', 'active'] } } },
    { $unwind: '$items' },
    { $group: { _id: null, totalOut: { $sum: '$items.quantity' } } }
  ]);
  const totalUnitsOut = activeOrdersItems[0]?.totalOut || 0;
  
  const utilizationRate = totalStock > 0 ? ((totalUnitsOut / (totalStock - totalInRepair)) * 100).toFixed(2) : 0;

  // 3. User Growth (Last 30 Days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const newUsersThisMonth = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  });

  // 4. Popular Products & Bundles
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

  // 5. Order Funnel
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: 'pending' });
  const activeRentals = await Order.countDocuments({ status: 'active' });
  const completedOrders = await Order.countDocuments({ status: 'completed' });

  // 6. Monthly Revenue Trend
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
      monthlyProgress: monthlyRevenue
    },
    inventory: {
      totalStock,
      totalUnitsOut,
      totalInRepair,
      utilizationRate: `${utilizationRate}%`
    },
    orders: {
      total: totalOrders,
      active: activeRentals,
      pending: pendingOrders,
      completed: completedOrders,
      recent: await Order.find().populate('user', 'name email').limit(5).sort('-createdAt')
    },
    users: {
      newThisMonth: newUsersThisMonth,
      total: await User.countDocuments()
    },
    popularProducts
  }, 'Advanced analytics retrieved successfully');
});
