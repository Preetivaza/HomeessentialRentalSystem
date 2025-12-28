import asyncHandler from '../middleware/asyncHandler.js';
import { ErrorResponse } from '../middleware/errorHandler.js';
import { sendResponse } from '../utils/ApiResponse.js';
import mockDB from '../config/mockDB.js';

const User = mockDB.User;

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, address } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ErrorResponse('User already exists with this email', 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    address
  });

  // TODO: Implement actual email service
  // await emailService.sendWelcomeEmail(user);

  const token = user.getSignedJwtToken();

  sendResponse(res, 201, {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  }, 'User registered successfully');
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  // Get user - mockDB returns user with password directly
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  if (!user.isActive) {
    return next(new ErrorResponse('Account is deactivated', 403));
  }

  const token = user.getSignedJwtToken();

  sendResponse(res, 200, {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  }, 'Login successful');
});

export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  sendResponse(res, 200, { user }, 'User profile retrieved');
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address
  };

  const user = await User.findByIdAndUpdate(
    req.user.id,
    fieldsToUpdate,
    {
      new: true,
      runValidators: true
    }
  );

  sendResponse(res, 200, { user }, 'Profile updated successfully');
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new ErrorResponse('Please provide current and new password', 400));
  }

  const user = await User.findById(req.user.id).select('+password');

  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  user.password = newPassword;
  await user.save();

  const token = user.getSignedJwtToken();

  sendResponse(res, 200, { token }, 'Password updated successfully');
});
