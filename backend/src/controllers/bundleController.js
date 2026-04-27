import asyncHandler from '../middleware/asyncHandler.js';
import { ErrorResponse } from '../middleware/errorHandler.js';
import { sendResponse } from '../utils/ApiResponse.js';
import Bundle from '../models/Bundle.js';

// @desc    Get all bundles
// @route   GET /api/bundles
// @access  Public
export const getBundles = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = { isActive: true };

  if (req.query.category) {
    filter.category = req.query.category;
  }

  const bundles = await Bundle.find(filter)
    .populate('items')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const total = await Bundle.countDocuments(filter);

  sendResponse(res, 200, {
    bundles,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBundles: total,
      hasMore: page * limit < total
    }
  }, 'Bundles retrieved successfully');
});

// @desc    Get single bundle
// @route   GET /api/bundles/:id
// @access  Public
export const getBundle = asyncHandler(async (req, res, next) => {
  const bundle = await Bundle.findById(req.params.id).populate('items');

  if (!bundle) {
    return next(new ErrorResponse('Bundle not found', 404));
  }

  sendResponse(res, 200, { bundle }, 'Bundle retrieved successfully');
});

// @desc    Create new bundle
// @route   POST /api/bundles
// @access  Private/Admin
export const createBundle = asyncHandler(async (req, res, next) => {
  const bundle = await Bundle.create(req.body);

  sendResponse(res, 201, { bundle }, 'Bundle created successfully');
});

// @desc    Update bundle
// @route   PUT /api/bundles/:id
// @access  Private/Admin
export const updateBundle = asyncHandler(async (req, res, next) => {
  let bundle = await Bundle.findById(req.params.id);

  if (!bundle) {
    return next(new ErrorResponse('Bundle not found', 404));
  }

  bundle = await Bundle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  sendResponse(res, 200, { bundle }, 'Bundle updated successfully');
});

// @desc    Delete bundle
// @route   DELETE /api/bundles/:id
// @access  Private/Admin
export const deleteBundle = asyncHandler(async (req, res, next) => {
  const bundle = await Bundle.findById(req.params.id);

  if (!bundle) {
    return next(new ErrorResponse('Bundle not found', 404));
  }

  await bundle.deleteOne();

  sendResponse(res, 200, {}, 'Bundle deleted successfully');
});
