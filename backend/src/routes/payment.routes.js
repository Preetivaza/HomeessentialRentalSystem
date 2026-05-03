import express from "express";
import rateLimit from "express-rate-limit";
import {
  createOrder,
  verifyPayment,
 
} from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Rate limiter (important for payments)
const paymentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
});

router.use(paymentLimiter);

// Validation middleware
const validateVerify = (req, res, next) => {
  const { orderId, paymentId, signature } = req.body;

  if (!orderId || !paymentId || !signature) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  next();
};

// Routes
router.post("/order", protect, createOrder);
router.post("/verify", protect, validateVerify, verifyPayment);
// router.post("/fail", protect, handleFailedPayment);

export default router;