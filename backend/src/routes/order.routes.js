import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  getAllOrders,
  cancelOrder
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import {
  createOrderBody,
  paginationQuery,
  listOrdersQuery,
  updateOrderStatusBody
} from '../middleware/schemas/order.schema.js';

const router = express.Router();

router.post('/', protect, validate(createOrderBody), createOrder);
router.get('/my-orders', protect, validate({ query: paginationQuery }), getMyOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/cancel', protect, cancelOrder);

router.get('/', protect, authorize('admin'), validate({ query: listOrdersQuery }), getAllOrders);
router.put('/:id/status', protect, authorize('admin'), validate({ body: updateOrderStatusBody }), updateOrderStatus);

export default router;
