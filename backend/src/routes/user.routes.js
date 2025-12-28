import express from 'express';
import {
  getUsers,
  getUser,
  updateUserRole,
  deleteUser,
  getUserStats
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/', getUsers);
router.get('/stats', getUserStats);
router.get('/:id', getUser);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

export default router;
