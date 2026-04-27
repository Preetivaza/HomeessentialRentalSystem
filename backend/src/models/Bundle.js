import mongoose from 'mongoose';

const bundleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a bundle name'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      minlength: [10, 'Description must be at least 10 characters']
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      }
    ],
    pricePerMonth: {
      type: Number,
      required: [true, 'Please add price per month'],
      min: [0, 'Price cannot be negative']
    },
    images: [{
      type: String,
      required: [true, 'Please add at least one image']
    }],
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['student', 'employee', 'family', 'other']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
bundleSchema.index({ category: 1 });
bundleSchema.index({ name: 'text', description: 'text' });
bundleSchema.index({ pricePerMonth: 1 });

export default mongoose.model('Bundle', bundleSchema);
