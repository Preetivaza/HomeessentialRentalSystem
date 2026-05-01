import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  checkAvailability,
  calculateCost
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import {
  productBody,
  listProductsQuery,
  availabilityQuery,
  calculateCostBody
} from '../middleware/schemas/product.schema.js';

const router = express.Router();

router.get('/', validate({ query: listProductsQuery }), getProducts);
router.get('/:id', getProduct);
router.get('/:id/availability', validate({ query: availabilityQuery }), checkAvailability);
router.post('/:id/calculate', validate({ body: calculateCostBody }), calculateCost);

router.post('/', protect, authorize('admin'), validate(productBody), createProduct);
router.put('/:id', protect, authorize('admin'), validate(productBody), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;
