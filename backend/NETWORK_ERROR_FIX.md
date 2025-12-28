# URGENT FIX NEEDED - Network Error Solution

## The Problem

Your backend server cannot connect to MongoDB Atlas because of authentication failure:
```
Error: bad auth : authentication failed
```

This means the **password** in your `.env` file is incorrect or has changed.

---

## Quick Fix - 3 Steps

### Step 1: Get Your Database Password

You have 2 options:

**Option A: Use existing password (if you remember it)**
- Skip to Step 2

**Option B: Reset password in MongoDB Atlas**
1. Go to: https://cloud.mongodb.com
2. Navigate to: **Security** → **Database Access**
3. Find user: `preetivaza_db_user`
4. Click **"Edit"**
5. Click **"Edit Password"**
6. Click **"Autogenerate Secure Password"** OR enter a simple password like `Test123456`
7. **COPY THE PASSWORD IMMEDIATELY!**
8. Click **"Update User"**

### Step 2: Update Your .env File

1. Open: `backend\.env`
2. Find the line starting with `MONGO_URI=`
3. Replace it with this (update YOUR_PASSWORD):

```env
MONGO_URI=mongodb+srv://preetivaza_db_user:YOUR_PASSWORD@cluster0.anwl8iu.mongodb.net/HomeEssentialsRentalSystem?retryWrites=true&w=majority&appName=Cluster0
```

**IMPORTANT:** 
- Replace `YOUR_PASSWORD` with your actual password
- If password has special characters like `_`, `@`, `#`, etc., URL-encode them:
  - `_` becomes `%5F`
  - `@` becomes `%40`
  - `#` becomes `%23`

**Example:**
If your password is `_12345678`, use:
```env
MONGO_URI=mongodb+srv://preetivaza_db_user:%5F12345678@cluster0.anwl8iu.mongodb.net/HomeEssentialsRentalSystem?retryWrites=true&w=majority&appName=Cluster0
```

### Step 3: Restart Backend Server

The server should automatically restart. You'll see:
```
MongoDB Connected: ac-l3mfpz8-shard-00-02.anwl8iu.mongodb.net
Server running in development mode on port 5000
```

---

## Then Try

Registration Again

1. Refresh your browser at http://localhost:3000
2. Go to Register page
3. Fill in your details
4. Click "Create Account"

**It should work now!** ✅

---

## If Still Not Working

Run this test command:
```bash
cd backend
npm run verify-auth
```

This will tell you exactly what's wrong with the connection.

---

## Need Your MongoDB Password?

**To get connection string with password:**
1. Go to: https://cloud.mongodb.com
2. Click: **Databases**
3. Click: **Connect** button on your cluster
4. Choose: **Connect your application**
5. Copy the connection string
6. It will show: `mongodb+srv://preetivaza_db_user:<password>@...`
7. Replace `<password>` with your actual password
8. Add the database name: `HomeEssentialsRentalSystem` before the `?`

---

**The network error will be fixed once the MongoDB connection is restored!**
