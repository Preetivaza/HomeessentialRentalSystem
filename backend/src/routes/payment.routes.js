import express from 'express';
import {
  createPaymentIntent,
  handleWebhook,
  getPaymentStatus,
  refundPayment
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-intent', protect, createPaymentIntent);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);
router.get('/:id', protect, getPaymentStatus);
router.post('/:id/refund', protect, authorize('admin'), refundPayment);

export default router;
