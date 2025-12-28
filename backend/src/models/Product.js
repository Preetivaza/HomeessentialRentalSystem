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
    dailyRate: {
      type: Number,
      required: [true, 'Please add daily rate'],
      min: [0, 'Daily rate cannot be negative']
    },
    monthlyRate: {
      type: Number,
      required: [true, 'Please add monthly rate'],
      min: [0, 'Monthly rate cannot be negative']
    },
    deposit: {
      type: Number,
      required: [true, 'Please add deposit amount'],
      min: [0, 'Deposit cannot be negative']
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 1
    },
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
productSchema.index({ dailyRate: 1, monthlyRate: 1 });

export default mongoose.model('Product', productSchema);
