import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

/**
 * 🔗 Razorpay connection (THIS is where .env is used)
 */

// =======================================================
// 🟢 CREATE ORDER (CONNECTS TO RAZORPAY)
// =======================================================

export const createOrder = async (req, res) => {
  const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
  try {
    const { orderId } = req.body;
    const user = req.user._id;

    // ── 1. Validate ─────────────────────────
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "orderId is required",
      });
    }

    // ── 2. Fetch Order ──────────────────────
    const order = await Order.findById(orderId).populate("productId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== user.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(409).json({
        success: false,
        message: "Order already paid",
      });
    }

    // ── 3. Prevent duplicate payment ────────
  const existing = await Payment.findOne({
  orderRef: orderId,
  status: { $in: ["pending", "success"] },
});

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Payment already initiated",
      });
    }

    // ── 4. Create Razorpay order ────────────
   const amountInPaise = Math.round(order.totalAmount * 100);

    if (amountInPaise <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
}

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${orderId}`,
      notes: {
        orderId: orderId.toString(),
        user: user.toString(),
      },
    });

    // ── 5. Save Payment ─────────────────────
   const payment = await Payment.create({
    user,
    orderRef: orderId,
    amount: order.totalAmount,
    orderId: razorpayOrder.id,
    status: "pending",
});

    // ── 6. Response ─────────────────────────
    return res.status(201).json({
      success: true,
      message: "Order created",
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        paymentId: payment._id,
      },
    });
  } catch (error) {
    console.error("createOrder error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// =======================================================
// 🔵 VERIFY PAYMENT
// =======================================================

export const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    const user = req.user._id;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ── 1. Verify signature ─────────────────
    const body = orderId + "|" + paymentId;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );

    if (!isValid) {
      // mark failed
     console.log("Payment failed:", {
        orderId,
        paymentId,
        user,
      });

      await Payment.findOneAndUpdate(
        { orderId },
        { status: "failed" }
      );

      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    // ── 2. Find Payment ─────────────────────
    const payment = await Payment.findOne({ orderId, user});

    if (payment && payment.user.toString() !== user.toString()) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
}
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.status === "success") {
      return res.status(409).json({
        success: false,
        message: "Already verified",
      });
    }

    // ── 3. Find Order ───────────────────────
   const order = await Order.findById(payment.orderRef);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(409).json({
        success: false,
        message: "Order already paid",
      });
    }

    // ── 4. Transaction ──────────────────────
    const session = await mongoose.startSession();

    await session.withTransaction(async () => {
      payment.status = "success";
      payment.paymentId = paymentId;
      payment.signature = signature;
      await payment.save({ session });

      order.paymentStatus = "paid";
      await order.save({ session });
    });

    session.endSession();
    return res.status(200).json({
      success: true,
      message: "Payment verified",
    });
  } catch (error) {
    console.error("verifyPayment error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};