import multer from 'multer';
import path from 'path';
import { ErrorResponse } from '../middleware/errorHandler.js';

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/identities');
  },
  filename: function (req, file, cb) {
    cb(null, `id-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new ErrorResponse('Only images (jpg, png) or PDFs are allowed for identity proof', 400));
  }
}

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

export default upload;
