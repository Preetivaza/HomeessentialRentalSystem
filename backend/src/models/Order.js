import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        dailyRate: {
          type: Number,
          required: true
        },
        monthlyRate: {
          type: Number,
          required: true
        }
      }
    ],
    rentalPeriod: {
      startDate: {
        type: Date,
        required: [true, 'Please add start date']
      },
      endDate: {
        type: Date,
        required: [true, 'Please add end date']
      },
      duration: {
        type: Number
      }
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    deposit: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    shippingAddress: {
      street: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      zipCode: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      }
    },
    notes: String
  },
  {
    timestamps: true
  }
);

// Calculate duration before saving
orderSchema.pre('save', function (next) {
  if (this.rentalPeriod.startDate && this.rentalPeriod.endDate) {
    const duration = Math.ceil(
      (this.rentalPeriod.endDate - this.rentalPeriod.startDate) / (1000 * 60 * 60 * 24)
    );
    this.rentalPeriod.duration = duration;
  }
  next();
});

// Indexes for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'rentalPeriod.startDate': 1, 'rentalPeriod.endDate': 1 });

export default mongoose.model('Order', orderSchema);
