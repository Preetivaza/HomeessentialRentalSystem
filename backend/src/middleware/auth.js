import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import { ErrorResponse } from './errorHandler.js';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return next(new ErrorResponse('User not found', 404));
    }
    
    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user.role}' is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

export const isVerified = asyncHandler(async (req, res, next) => {
  if (req.user.verificationStatus !== 'verified') {
    return next(
      new ErrorResponse(
        'Your identity has not been verified. Please upload your ID proof and wait for admin approval before renting.',
        403
      )
    );
  }
  next();
});
