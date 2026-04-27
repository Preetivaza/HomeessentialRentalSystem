import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      minlength: [10, 'Description must be at least 10 characters']
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['furniture', 'appliances', 'electronics', 'fitness', 'other']
    },
    images: [{
      type: String,
      required: [true, 'Please add at least one image']
    }],
    pricePerDay: {
      type: Number,
      required: [true, 'Please add a daily price'],
      min: [0, 'Price cannot be negative']
    },
    securityDeposit: {
      type: Number,
      required: [true, 'Please add a security deposit amount'],
      min: [0, 'Deposit cannot be negative']
    },
    lateFeePerDay: {
      type: Number,
      default: 0,
      min: [0, 'Late fee cannot be negative']
    },
    minRentalDays: {
      type: Number,
      default: 1,
      min: [1, 'Minimum rental days must be at least 1']
    },
    maxRentalDays: {
      type: Number,
      min: [1, 'Maximum rental days must be at least 1']
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 1
    },
    reserved: {
      type: Number,
      default: 0,
      min: [0, 'Reserved stock cannot be negative']
    },
    bookedRanges: [
      {
        startDate: Date,
        endDate: Date
      }
    ],
    specifications: {
      type: Map,
      of: String
    },
    tags: [{
      type: String,
      trim: true
    }],
    isAvailable: {
      type: Boolean,
      default: true
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    },
    condition: {
      type: String,
      enum: ['new', 'good', 'fair', 'needs_repair'],
      default: 'new'
    },
    maintenanceStatus: {
      isUnderMaintenance: {
        type: Boolean,
        default: false
      },
      lastMaintenanceDate: Date,
      nextScheduledMaintenance: Date
    },
    inMaintenanceCount: {
      type: Number, // Number of items CURRENTLY in repair
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for filtering and search
productSchema.index({ category: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ pricePerDay: 1 });

export default mongoose.model('Product', productSchema);
