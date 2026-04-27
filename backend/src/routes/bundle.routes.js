import express from 'express';
import {
  getBundles,
  getBundle,
  createBundle,
  updateBundle,
  deleteBundle
} from '../controllers/bundleController.js';
import { protect, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { validateBundle } from '../utils/validators.js';

const router = express.Router();

router.get('/', getBundles);
router.get('/:id', getBundle);

router.post('/', protect, authorize('admin'), validate(validateBundle), createBundle);
router.put('/:id', protect, authorize('admin'), validate(validateBundle), updateBundle);
router.delete('/:id', protect, authorize('admin'), deleteBundle);

export default router;
