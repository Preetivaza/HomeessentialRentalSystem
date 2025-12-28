# Connecting to Your Existing MongoDB Atlas Database

## Your Database Details

✅ **Database Name**: `HomeEssentialsRentalSystem`
✅ **Collection**: `products` (already exists)
✅ **Cluster**: Already created in MongoDB Atlas

---

## Get Your Connection String

### Step 1: Go to Database Connect

1. In MongoDB Atlas, click on **"Database"** in the left sidebar
2. Find your cluster
3. Click the **"Connect"** button

### Step 2: Choose Connection Method

1. Select **"Connect your application"**
2. Make sure:
   - **Driver**: Node.js
   - **Version**: 5.5 or later

### Step 3: Copy Connection String

You'll see a string like:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

## Update Your Backend .env File

**Open**: `backend/.env`

**Find the MONGO_URI line and replace it with:**

```env
MONGO_URI=mongodb+srv://<username>:<password>@<your-cluster>.mongodb.net/HomeEssentialsRentalSystem?retryWrites=true&w=majority
```

### Important Changes:

1. **Replace** `<username>` with your database username
2. **Replace** `<password>` with your database password
3. **Replace** `<your-cluster>` with your cluster URL
4. **Keep** `/HomeEssentialsRentalSystem` (this is your database name)

### Example:
```env
MONGO_URI=mongodb+srv://myuser:MyPassword123@cluster0.abc123.mongodb.net/HomeEssentialsRentalSystem?retryWrites=true&w=majority
```

---

## Quick Alternative: Connection String from Atlas

1. In Atlas, go to: **Database → Connect → Connect your application**
2. Copy the connection string
3. Modify it to add `/HomeEssentialsRentalSystem`:
   
   **Before:**
   ```
   mongodb+srv://user:pass@cluster.net/?retryWrites=true&w=majority
   ```
   
   **After:**
   ```
   mongodb+srv://user:pass@cluster.net/HomeEssentialsRentalSystem?retryWrites=true&w=majority
   ```
   
   (Add `/HomeEssentialsRentalSystem` before the `?`)

---

## Test Connection

Once you update `.env`:

```bash
cd backend
npm run test-db
```

**Expected Output:**
```
MongoDB Connected: cluster0.xxxxx.mongodb.net:27017
✅ SUCCESS: Database connection established!
```

---

## Start Your Server

```bash
npm run dev
```

Your backend will now connect to your existing Atlas database and use the `HomeEssentialsRentalSystem` database with the `products` collection!

---

## Notes

- Your backend models will automatically create collections:
  - `users` (for authentication)
  - `products` (already exists!)
  - `orders` (for rental orders)
  - `payments` (for Stripe payments)

- The existing `products` collection will be used by the backend
- New collections will be created automatically when you create your first document

Ready to test! 🚀
