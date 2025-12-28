# Home Essentials Rental System

Full-stack MERN rental application for home essentials with authentication, payments, and inventory management.

## Project Structure

```
RentalHomeSystem/
├── frontend/           # React + Vite frontend
├── backend/            # Node.js + Express API
└── README.md          # This file
```

## Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Payments**: Stripe
- **Security**: Helmet, CORS, Rate Limiting

## Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Stripe account

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

### Backend Setup

```bash
cd backend
npm install

# Configure .env file
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and Stripe keys

npm run dev
```

Backend runs on: `http://localhost:5000`

## Features

### Customer Features
- Browse products with filters and search
- Check product availability by dates
- Create rental orders
- Secure Stripe payments
- Order tracking and history
- Profile management

### Admin Features
- Product CRUD operations
- Order management
- User management
- Dashboard analytics
- Payment and refund processing

## API Documentation

See [backend/README.md](backend/README.md) for complete API documentation.

## Development

### Frontend Development
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend Development
```bash
cd backend
npm run dev      # Start with auto-reload
npm start        # Start production server
```

## Environment Variables

### Frontend
Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### Backend
Create `backend/.env`:
```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
STRIPE_WEBHOOK_SECRET=your_webhook_secret
CLIENT_URL=http://localhost:5173
```

## Deployment

### Frontend
- Deploy to: Vercel, Netlify, or Cloudflare Pages
- Build command: `npm run build`
- Output directory: `dist`

### Backend
- Deploy to: Railway, Render, or Heroku
- Use MongoDB Atlas for database
- Configure webhook endpoint in Stripe dashboard

## License

ISC
