import express from 'express';
import {
  getUsers,
  getUser,
  updateUserRole,
  deleteUser,
  getUserStats,
  uploadIdentityProof,
  verifyUser
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../utils/upload-id.js';

const router = express.Router();

// Protected routes (any logged in user)
router.use(protect);
router.post('/upload-id', upload.single('idProof'), uploadIdentityProof);

// Admin only routes
router.use(authorize('admin'));
router.get('/', getUsers);
router.get('/stats', getUserStats);
router.get('/:id', getUser);
router.put('/:id/role', updateUserRole);
router.put('/:id/verify', verifyUser);
router.delete('/:id', deleteUser);

export default router;
