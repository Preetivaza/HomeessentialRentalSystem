import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { seedInitialStaticProducts } from './config/seedProducts.js';
import { errorHandler } from './middleware/errorHandler.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import userRoutes from './routes/user.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import bundleRoutes from './routes/bundle.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDB().then(() => {
  seedInitialStaticProducts().then(() => {
  });
});

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/identities');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      
      
    ].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE","OPTIONS"],
    credentials: true,
  })
);
app.options("*", cors());

app.use(helmet());
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api', limiter);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/bundles', bundleRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('SIGTERM', () => {
  if (server) {
    server.close(() => {
    });
  }
});

export default app;
