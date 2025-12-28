import asyncHandler from '../middleware/asyncHandler.js';
import { ErrorResponse } from '../middleware/errorHandler.js';
import { sendResponse } from '../utils/ApiResponse.js';
import User from '../models/User.js';

export const getUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.role) {
    filter.role = req.query.role;
  }

  const users = await User.find(filter)
    .select('-password')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(filter);

  sendResponse(res, 200, {
    users,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    }
  }, 'Users retrieved successfully');
});

export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  sendResponse(res, 200, { user }, 'User retrieved successfully');
});

export const updateUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;

  if (!['customer', 'admin'].includes(role)) {
    return next(new ErrorResponse('Invalid role', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  sendResponse(res, 200, { user }, 'User role updated successfully');
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  await user.deleteOne();

  sendResponse(res, 200, {}, 'User deleted successfully');
});

export const getUserStats = asyncHandler(async (req, res, next) => {
  const totalUsers = await User.countDocuments();
  const totalCustomers = await User.countDocuments({ role: 'customer' });
  const totalAdmins = await User.countDocuments({ role: 'admin' });
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newUsersThisMonth = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  });

  sendResponse(res, 200, {
    totalUsers,
    totalCustomers,
    totalAdmins,
    newUsersThisMonth
  }, 'User statistics retrieved');
});
