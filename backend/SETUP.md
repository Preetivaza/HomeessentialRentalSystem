# Backend Setup Guide

## Prerequisites

✅ Node.js installed (v18+)  
✅ MongoDB installed locally OR MongoDB Atlas account  

## Setup Steps

### 1. Install Dependencies (Already Done ✅)

```bash
cd backend
npm install
```

**Installed**: 118 packages including Express, Mongoose, JWT, Stripe, etc.

### 2. Configure Environment Variables

**Option A: Manual Setup (Recommended)**
1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your values:
   ```env
   # For Local MongoDB:
   MONGO_URI=mongodb://localhost:27017/rental-home-system
   
   # OR for MongoDB Atlas:
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/rental-home-system
   
   JWT_SECRET=your_secret_key_here_change_in_production
   JWT_EXPIRE=30d
   
   # Add Stripe keys later
   STRIPE_SECRET_KEY=sk_test_your_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   STRIPE_WEBHOOK_SECRET=whsec_your_secret
   
   CLIENT_URL=http://localhost:5173
   ```

**Option B: Use PowerShell**
```powershell
Copy-Item .env.example .env
```

### 3. Start MongoDB

**For Local MongoDB:**
```bash
# Windows (if installed as service):
net start MongoDB

# Or run manually:
mongod --dbpath C:\data\db
```

**For MongoDB Atlas:**
- No action needed, already running in cloud
- Just use your Atlas connection string in MONGO_URI

### 4. Test Database Connection

```bash
npm run test-db
```

This will verify your MongoDB connection is working.

### 5. Start the Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Server will run on: `http://localhost:5000`

### 6. Verify Server is Running

Open browser or use curl:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-12-26T..."
}
```

## Quick MongoDB Setup Options

### Option 1: Local MongoDB (Windows)

1. **Download**: https://www.mongodb.com/try/download/community
2. **Install**: Run installer with default settings
3. **Verify**: 
   ```bash
   mongod --version
   ```
4. **Start**: MongoDB runs as Windows service automatically
5. **Connection String**: `mongodb://localhost:27017/rental-home-system`

### Option 2: MongoDB Atlas (Cloud - Free Tier)

1. **Sign up**: https://www.mongodb.com/cloud/atlas/register
2. **Create Cluster**: 
   - Select FREE tier (M0)
   - Choose closest region
3. **Create Database User**:
   - Database Access → Add User
   - Username & Password
4. **Whitelist IP**:
   - Network Access → Add IP Address
   - Allow from anywhere: `0.0.0.0/0` (development only)
5. **Get Connection String**:
   - Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your user password
6. **Example**: 
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/rental-home-system
   ```

## Testing API Endpoints

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "phone": "+1234567890"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Copy the `token` from response to use in protected routes.

### 4. Get Profile (Protected)
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Error: "Cannot connect to MongoDB"
- ✅ Check if MongoDB is running
- ✅ Verify MONGO_URI in .env
- ✅ Check network/firewall settings

### Error: "Module not found"
- Run: `npm install`

### Error: "PORT already in use"
- Change PORT in .env to another number (e.g., 5001)

### Error: "Invalid token"
- Token expired or invalid JWT_SECRET
- Login again to get new token

## Next Steps

1. ✅ Backend API is running
2. 🔄 Test all endpoints with Postman/Thunder Client
3. 🔄 Seed database with sample products (optional)
4. 🔄 Connect frontend to backend APIs
5. 🔄 Add Stripe keys for payment testing

## Useful Commands

```bash
# Install dependencies
npm install

# Test database connection
npm run test-db

# Start development server
npm run dev

# Start production server
npm start

# Check MongoDB status (Windows)
sc query MongoDB
```

Your backend is production-ready! 🚀
