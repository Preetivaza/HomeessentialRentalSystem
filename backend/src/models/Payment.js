import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    paymentId: {
      type: String,
      default: null,
    },

    signature: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Indexes (NO duplicates)
paymentSchema.index({ orderRef: 1 });
paymentSchema.index({ user: 1 });

export default mongoose.model("Payment", paymentSchema);