# Get Your MongoDB Connection String - Step by Step

## You Are Here 👇
You have MongoDB Atlas open in your browser with database `HomeEssentialsRentalSystem`

## Follow These Exact Steps:

### Step 1: Go to Database Section
1. In the LEFT sidebar, click on **"Database"** (it has a database icon)
2. You should see your cluster listed

### Step 2: Click Connect Button
1. Find your cluster (it should show "Cluster0" or similar name)
2. Click the **"Connect"** button (it's a big button next to your cluster)

### Step 3: Choose Connection Method
1. A popup will appear with 3 options
2. Click on **"Connect your application"**

### Step 4: Copy Connection String
1. Make sure it shows:
   - **Driver**: Node.js
   - **Version**: 5.5 or later
2. You'll see a connection string that looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
3. Click the **"Copy"** button next to it

### Step 5: Paste Here
📋 **Paste your connection string below this line:**
```
[PASTE YOUR CONNECTION STRING HERE]
```

### Step 6: I'll Help You Format It
Once you paste it, I'll:
1. Add the database name `HomeEssentialsRentalSystem`
2. Update your `.env` file
3. Test the connection
4. Start your server

---

## Alternative: Manual Setup

If you prefer to do it yourself:

1. Copy your connection string from Atlas
2. Open `backend/.env`
3. Update line 12 to:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/HomeEssentialsRentalSystem?retryWrites=true&w=majority
   ```
4. Replace:
   - `username` with your database username
   - `password` with your database password
   - `cluster` with your cluster URL
5. Save the file
6. Run: `npm run test-db`

---

## Need Your Database Username/Password?

If you don't remember:

1. Go to **"Database Access"** in left sidebar
2. You'll see your database users listed
3. To reset password:
   - Click **"Edit"** next to the user
   - Click **"Edit Password"**
   - Generate new password or create your own
   - Click **"Update User"**

---

**Just paste your connection string and I'll handle the rest!** 🚀
