import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { validateRegister, validateLogin } from '../utils/validators.js';

const router = express.Router();

router.post('/register', validate(validateRegister), register);
router.post('/login', validate(validateLogin), login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);

export default router;
