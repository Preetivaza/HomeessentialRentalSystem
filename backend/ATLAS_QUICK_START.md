# Quick MongoDB Atlas Setup

Follow this checklist to connect your backend to MongoDB Atlas cloud database.

## Setup Checklist

### 1. Create Account & Cluster (3 mins)
- [ ] Go to https://www.mongodb.com/cloud/atlas/register
- [ ] Sign up (use Google for fastest signup)
- [ ] Click "Build a Database"
- [ ] Choose **FREE M0 tier**
- [ ] Select closest region to you
- [ ] Click "Create Cluster" (wait 1-3 mins)

### 2. Security Setup (2 mins)
- [ ] Go to "Database Access" → Add Database User
  - Username: `rentaladmin`
  - Password: Create strong password (SAVE IT!)
  - Privileges: "Read and write to any database"
- [ ] Go to "Network Access" → Add IP Address
  - Choose "Allow Access from Anywhere" (0.0.0.0/0)

### 3. Get Connection String (1 min)
- [ ] Go to "Database" → Click "Connect" on your cluster
- [ ] Choose "Connect your application"
- [ ] Driver: Node.js, Version: 5.5+
- [ ] Copy the connection string

### 4. Update Backend (1 min)
- [ ] Open `backend/.env` file
- [ ] Update MONGO_URI line:
  ```env
  MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/rental-home-system?retryWrites=true&w=majority
  ```
- [ ] Replace `USERNAME` and `PASSWORD` with your credentials
- [ ] Make sure `/rental-home-system` is added before the `?`

### 5. Test Connection ✅
```bash
cd backend
npm run test-db
```

### 6. Start Server 🚀
```bash
npm run dev
```

---

## Your Connection String Template

```
mongodb+srv://rentaladmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/rental-home-system?retryWrites=true&w=majority
```

**Important:**
- Replace `YOUR_PASSWORD` with actual password
- If password has `@`, `!`, `#` → encode them (`%40`, `%21`, `%23`)
- Keep `/rental-home-system` to specify database name

---

## Verification

Once server starts, test:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "success": true,
  "message": "Server is running"
}
```

Need detailed help? See `ATLAS_SETUP.md` for full guide with troubleshooting.
