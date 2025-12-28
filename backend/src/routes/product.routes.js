import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  checkAvailability
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { validateProduct } from '../utils/validators.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.get('/:id/availability', checkAvailability);

router.post('/', protect, authorize('admin'), validate(validateProduct), createProduct);
router.put('/:id', protect, authorize('admin'), validate(validateProduct), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;
