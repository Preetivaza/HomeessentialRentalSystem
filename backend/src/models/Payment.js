import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    stripePaymentIntentId: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'inr',
      uppercase: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'succeeded', 'failed', 'canceled', 'refunded'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'netbanking'],
      default: 'card'
    },
    metadata: {
      type: Map,
      of: String
    }
  },
  {
    timestamps: true
  }
);

// Index for payment lookup
paymentSchema.index({ stripePaymentIntentId: 1 });
paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1 });

export default mongoose.model('Payment', paymentSchema);
