import asyncHandler from '../middleware/asyncHandler.js';
import { sendResponse } from '../utils/ApiResponse.js';
import authService from '../services/authService.js';

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, address } = req.body;
  const { token, user } = await authService.register({
    name,
    email,
    password,
    phone,
    address,
    ip: req.ip,
  });

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
  const { token, user } = await authService.login({ email, password, ip: req.ip });

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

export const googleLogin = asyncHandler(async (req, res, next) => {
  const { token: idToken } = req.body;
  const { token, user } = await authService.googleLogin({ idToken, ip: req.ip });

  sendResponse(
    res,
    200,
    {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        authProvider: user.authProvider,
      },
    },
    'Google Login successful'
  );
});

export const getMe = asyncHandler(async (req, res, next) => {
  const user = await authService.getMe(req.user.id);
  sendResponse(res, 200, { user }, 'User profile retrieved');
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const updatedUser = await authService.updateProfile(req.user.id, req.body);
  sendResponse(res, 200, { user: updatedUser }, 'Profile updated successfully');
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const { token } = await authService.updatePassword(req.user.id, { currentPassword, newPassword });
  sendResponse(res, 200, { token }, 'Password updated successfully');
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  sendResponse(res, 200, {}, 'Email sent successfully');
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = await authService.resetPassword(req.params.resetToken, req.body.password);
  sendResponse(res, 200, { token }, 'Password reset successful');
});
