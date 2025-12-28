# MongoDB Atlas Setup Guide

## Step-by-Step Setup (5 minutes)

### Step 1: Create MongoDB Atlas Account

1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with:
   - Google account (recommended - fastest)
   - OR email/password

### Step 2: Create a FREE Cluster

1. After login, click **"Build a Database"** or **"Create"**
2. Choose **FREE tier (M0)**:
   - Select **"M0 Sandbox"** (FREE forever)
   - Storage: 512 MB (enough for development)
3. Choose **Cloud Provider & Region**:
   - Provider: AWS, Google Cloud, or Azure (any is fine)
   - Region: Select closest to you (e.g., Mumbai, Singapore for India)
4. **Cluster Name**: Leave default or name it `RentalHomeCluster`
5. Click **"Create Cluster"** (takes 1-3 minutes to provision)

### Step 3: Create Database User

1. Click **"Database Access"** in left sidebar (under Security)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set credentials:
   ```
   Username: rentaladmin
   Password: [Generate a secure password] or create your own
   ```
   **⚠️ IMPORTANT: Save these credentials - you'll need them!**

5. Database User Privileges: **"Read and write to any database"**
6. Click **"Add User"**

### Step 4: Whitelist Your IP Address

1. Click **"Network Access"** in left sidebar (under Security)
2. Click **"Add IP Address"**
3. For development, choose:
   - **"Allow Access from Anywhere"**: `0.0.0.0/0`
   - (For production, you'd add specific IPs)
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Go back to **"Database"** (left sidebar)
2. Your cluster should be ready (green status)
3. Click **"Connect"** button on your cluster
4. Choose **"Connect your application"**
5. Driver: **Node.js**, Version: **5.5 or later**
6. Copy the connection string - it looks like:
   ```
   mongodb+srv://rentaladmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update Your Backend .env File

1. Open: `backend/.env`
2. Find the `MONGO_URI` line
3. Replace it with your Atlas connection string:
   ```env
   MONGO_URI=mongodb+srv://rentaladmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/rental-home-system?retryWrites=true&w=majority
   ```

**⚠️ IMPORTANT CHANGES:**
- Replace `<password>` with your actual password
- Add `/rental-home-system` before the `?` to specify database name

**Example:**
```env
MONGO_URI=mongodb+srv://rentaladmin:MySecurePass123@cluster0.abc123.mongodb.net/rental-home-system?retryWrites=true&w=majority
```

### Step 7: Test Connection

```bash
cd backend
npm run test-db
```

**Expected Output:**
```
========================================
Testing MongoDB Connection...
========================================
Environment: development
MongoDB URI: mongodb+srv://rentaladmin:<credentials>@cluster0...
========================================

MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net:27017

✅ SUCCESS: Database connection established!
========================================
Your backend is ready to use.
You can now start the server with: npm run dev
========================================
```

### Step 8: Start Your Server

```bash
npm run dev
```

Server runs on: `http://localhost:5000`

---

## Quick Visual Guide

```
1. Sign Up → 2. Create Cluster → 3. Create User → 4. Add IP → 5. Get String → 6. Update .env → 7. Test!
```

---

## Troubleshooting

### Error: "Authentication failed"
- Check username and password in connection string
- Make sure password doesn't contain special characters (or URL encode them)
- Verify database user was created correctly

### Error: "IP not whitelisted"
- Go to Network Access
- Add `0.0.0.0/0` to allow all IPs (development only)

### Error: "Connection timeout"
- Check your internet connection
- Verify network access settings in Atlas
- Try a different region if cluster is too far

### Special Characters in Password?
If your password has special characters like `@`, `!`, `#`, encode them:
- `@` → `%40`
- `!` → `%21`
- `#` → `%23`

**Example:**
```
Password: Pass@123!
Encoded: Pass%40123%21
```

---

## Your Connection String Format

```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

**Replace:**
- `USERNAME` → Your database username (e.g., `rentaladmin`)
- `PASSWORD` → Your database password (URL encoded if special chars)
- `CLUSTER` → Your cluster URL (from Atlas)
- `DATABASE_NAME` → `rental-home-system`

---

## Benefits of MongoDB Atlas

✅ No local installation needed  
✅ Always available (cloud)  
✅ Free 512MB tier  
✅ Automatic backups  
✅ Easy scaling  
✅ Works from anywhere  

---

## Next Steps After Connection

1. ✅ Test connection: `npm run test-db`
2. ✅ Start server: `npm run dev`
3. ✅ Test API: `curl http://localhost:5000/api/health`
4. ✅ Create first user: POST to `/api/auth/register`

Your backend is now connected to a cloud database! 🎉
