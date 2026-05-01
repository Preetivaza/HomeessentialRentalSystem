import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import emailService from './emailService.js';
import { ErrorResponse } from '../middleware/errorHandler.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthService {
  async register({ name, email, password, phone, address, ip }) {
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new ErrorResponse('User already exists with this email', 400);
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      loginHistory: [{ ip }],
    });

    const token = user.getSignedJwtToken();
    return { token, user };
  }

  async login({ email, password, ip }) {
    if (!email || !password) {
      throw new ErrorResponse('Please provide email and password', 400);
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ErrorResponse('Invalid credentials', 401);
    }

    if (user.authProvider === 'google') {
      throw new ErrorResponse('Please use Google Login for this account', 400);
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new ErrorResponse('Invalid credentials', 401);
    }

    if (!user.isActive) {
      throw new ErrorResponse('Account is deactivated', 403);
    }

    user.loginHistory.push({ ip });
    if (user.loginHistory.length > 10) user.loginHistory.shift();
    await user.save();

    const token = user.getSignedJwtToken();
    return { token, user };
  }

  async googleLogin({ idToken, ip }) {
    if (!idToken) {
      throw new ErrorResponse('Google token is required', 400);
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (err) {
      throw new ErrorResponse('Invalid Google token', 401);
    }

    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
      }
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        authProvider: 'google',
      });
    }

    if (!user.isActive) {
      throw new ErrorResponse('Account is deactivated', 403);
    }

    user.loginHistory.push({ ip });
    if (user.loginHistory.length > 10) user.loginHistory.shift();
    await user.save();

    const token = user.getSignedJwtToken();
    return { token, user };
  }

  async getMe(userId) {
    return await User.findById(userId);
  }

  async updateProfile(userId, payload) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ErrorResponse('User not found', 404);
    }

    if (user.authProvider === 'google' && payload.email && payload.email !== user.email) {
      throw new ErrorResponse('Email cannot be changed for Google accounts', 400);
    }

    const fieldsToUpdate = {
      name: payload.name || user.name,
      phone: payload.phone || user.phone,
      address: payload.address || user.address,
    };

    return await User.findByIdAndUpdate(userId, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });
  }

  async updatePassword(userId, { currentPassword, newPassword }) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new ErrorResponse('User not found', 404);
    }

    if (user.authProvider === 'google') {
      throw new ErrorResponse('Password cannot be changed for Google accounts', 400);
    }

    if (!currentPassword || !newPassword) {
      throw new ErrorResponse('Please provide current and new password', 400);
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      throw new ErrorResponse('Current password is incorrect', 401);
    }

    user.password = newPassword;
    await user.save();

    const token = user.getSignedJwtToken();
    return { token };
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ErrorResponse('No user found with that email', 404);
    }

    if (user.authProvider === 'google') {
      throw new ErrorResponse('Please use Google Login for this account', 400);
    }

    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    try {
      await emailService.sendPasswordReset(user, resetToken);
      return;
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      throw new ErrorResponse('Email could not be sent', 500);
    }
  }

  async resetPassword(resetTokenParam, newPassword) {
    const resetPasswordToken = crypto.createHash('sha256').update(resetTokenParam).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new ErrorResponse('Invalid or expired token', 400);
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = user.getSignedJwtToken();
    return { token };
  }
}

export default new AuthService();

