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
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        name: {
          type: String,
          required: true
        },
        pricePerDay: {
          type: Number,
          required: true
        },
        securityDeposit: {
          type: Number,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        startDate: {
          type: Date,
          required: true
        },
        endDate: {
          type: Date,
          required: true
        },
        duration: {
          type: Number,
          required: true
        },
        baseRent: {
          type: Number,
          required: true
        },
        deposit: {
          type: Number,
          required: true
        },
        tax: {
          type: Number,
          required: true
        },
        total: {
          type: Number,
          required: true
        }
      }
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    securityDeposit: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    discountCode: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'active', 'completed', 'cancelled'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending'
    },
    lateFeeApplied: {
      type: Number,
      default: 0
    },
    refundAmount: {
      type: Number,
      default: 0
    },
    insurance: {
      opted: {
        type: Boolean,
        default: false
      },
      amount: {
        type: Number,
        default: 0
      }
    },
    depositStatus: {
      type: String,
      enum: ['held', 'refunded', 'deducted'],
      default: 'held'
    },
    damageDeduction: {
      type: Number,
      default: 0
    },
    logistics: {
      status: {
        type: String,
        enum: ['pending', 'scheduled', 'out_for_delivery', 'delivered', 'pickup_scheduled', 'picked_up'],
        default: 'pending'
      },
      deliverySlot: {
        date: Date,
        timeWindow: {
          type: String,
          enum: ['morning', 'afternoon', 'evening'] // e.g. 9-1, 2-6, 6-9
        }
      },
      pickupSlot: {
        date: Date,
        timeWindow: {
          type: String,
          enum: ['morning', 'afternoon', 'evening']
        }
      }
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
    notes: String,
    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true
    },
    bundle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bundle'
    }
  },
  {
    timestamps: true
  }
);

// Items duration should be calculated before saving if not provided
orderSchema.pre('save', function (next) {
  if (this.items && this.items.length > 0) {
    this.items.forEach(item => {
      if (item.startDate && item.endDate && !item.duration) {
        item.duration = Math.ceil(
          (item.endDate - item.startDate) / (1000 * 60 * 60 * 24)
        );
      }
    });
  }
  next();
});

// Indexes for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'items.startDate': 1, 'items.endDate': 1 });

export default mongoose.model('Order', orderSchema);
