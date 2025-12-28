# Home Essentials Rental System - Backend API

Production-ready REST API for home essentials rental system built with Node.js, Express, MongoDB, and Stripe.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Payment**: Stripe
- **Security**: Helmet, CORS, express-mongo-sanitize, express-rate-limit
- **Validation**: Custom validators with validator.js

## Architecture

```
backend/
├── src/
│   ├── config/           # Database & Stripe configuration
│   │   ├── db.js
│   │   └── stripe.js
│   ├── models/           # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Payment.js
│   ├── controllers/      # Route handlers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── userController.js
│   │   └── dashboardController.js
│   ├── routes/           # Express routes
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── order.routes.js
│   │   ├── payment.routes.js
│   │   ├── user.routes.js
│   │   └── dashboard.routes.js
│   ├── middleware/       # Custom middleware
│   │   ├── asyncHandler.js
│   │   ├── errorHandler.js
│   │   ├── auth.js
│   │   └── validate.js
│   ├── services/         # Business logic
│   │   ├── emailService.js
│   │   └── inventoryService.js
│   ├── utils/            # Helper functions
│   │   ├── ApiResponse.js
│   │   └── validators.js
│   └── server.js         # Entry point
├── .env.example
├── .gitignore
└── package.json
```

## Setup & Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Stripe account

### Installation Steps

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your values:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   CLIENT_URL=http://localhost:5173
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Verify server is running**
   ```bash
   curl http://localhost:5000/api/health
   ```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user (protected)
- `PUT /profile` - Update profile (protected)
- `PUT /password` - Update password (protected)

### Products (`/api/products`)
- `GET /` - Get all products (with filters & pagination)
- `GET /:id` - Get single product
- `GET /:id/availability` - Check product availability
- `POST /` - Create product (admin only)
- `PUT /:id` - Update product (admin only)
- `DELETE /:id` - Delete product (admin only)

### Orders (`/api/orders`)
- `POST /` - Create order (protected)
- `GET /my-orders` - Get user orders (protected)
- `GET /:id` - Get single order (protected)
- `PUT /:id/cancel` - Cancel order (protected)
- `GET /` - Get all orders (admin only)
- `PUT /:id/status` - Update order status (admin only)

### Payments (`/api/payments`)
- `POST /create-intent` - Create payment intent (protected)
- `POST /webhook` - Stripe webhook (public)
- `GET /:id` - Get payment status (protected)
- `POST /:id/refund` - Refund payment (admin only)

### Users (`/api/users`)
All routes are admin only:
- `GET /` - Get all users
- `GET /stats` - Get user statistics
- `GET /:id` - Get single user
- `PUT /:id/role` - Update user role
- `DELETE /:id` - Delete user

### Dashboard (`/api/dashboard`)
- `GET /stats` - Get dashboard analytics (admin only)

## Features

### Security
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (customer/admin)
- Rate limiting (100 requests per 15 minutes)
- MongoDB injection prevention
- HTTP security headers (Helmet)
- CORS configuration

### Database
- Normalized schema design
- Proper indexing for performance
- Schema validation
- Mongoose middleware for business logic

### Error Handling
- Centralized error handling
- Custom error responses
- Proper HTTP status codes
- Development vs production error messages

### Pagination & Filtering
- Query-based pagination
- Category filtering
- Price range filtering
- Text search
- Custom sorting

### Payment Integration
- Stripe payment intents
- Webhook handling
- Payment status tracking
- Refund processing

### Inventory Management
- Date-based availability checking
- Stock validation
- Overlapping rental detection

## API Response Format

### Success Response
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Testing with Postman/Thunder Client

1. **Register a user**
   ```
   POST http://localhost:5000/api/auth/register
   Body: {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123",
     "phone": "+1234567890"
   }
   ```

2. **Login**
   ```
   POST http://localhost:5000/api/auth/login
   Body: {
     "email": "john@example.com",
     "password": "password123"
   }
   ```
   
   Copy the `token` from response.

3. **Access protected routes**
   ```
   Headers:
   Authorization: Bearer YOUR_TOKEN_HERE
   ```

## Database Models

### User
- Authentication & profile management
- Role-based access (customer/admin)

### Product
- Product catalog with categories
- Daily & monthly rates
- Stock management
- Ratings & reviews support

### Order
- Rental period tracking
- Order status lifecycle
- Payment integration
- Shipping information

### Payment
- Stripe payment integration
- Transaction history
- Refund tracking

## Deployment

### Environment Setup
Ensure all production environment variables are set:
- Use strong JWT secret
- Use production MongoDB URI
- Configure production CORS origins
- Set NODE_ENV=production

### Recommended Hosting
- **Backend**: Railway, Render, Heroku
- **Database**: MongoDB Atlas
- **Payment**: Stripe (production keys)

## License

ISC
