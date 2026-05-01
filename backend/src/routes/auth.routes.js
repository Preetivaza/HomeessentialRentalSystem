import express from 'express';
import {
  register,
  login,
  googleLogin,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import {
  registerBody,
  loginBody,
  googleLoginBody,
  forgotPasswordBody,
  resetPasswordParams,
  resetPasswordBody
} from '../middleware/schemas/auth.schema.js';

const router = express.Router();

router.post('/register', validate(registerBody), register);
router.post('/login', validate(loginBody), login);
router.post('/google', validate(googleLoginBody), googleLogin);
router.post('/forgot-password', validate(forgotPasswordBody), forgotPassword);
router.put('/reset-password/:resetToken', validate({ params: resetPasswordParams, body: resetPasswordBody }), resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);

export default router;
