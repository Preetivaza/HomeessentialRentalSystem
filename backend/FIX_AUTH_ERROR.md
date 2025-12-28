# MongoDB Atlas Authentication Error - Fix Guide

## Error Encountered
```
Error: bad auth : authentication failed
```

This means the username or password in your connection string doesn't match what's configured in MongoDB Atlas.

---

## Solution: Verify & Update Database User

### Step 1: Check Database User in Atlas

1. In MongoDB Atlas, go to **"Database Access"** (left sidebar, under Security)
2. Look for user: `preetivaza_db_user`
3. Check if this user exists

### Step 2: Reset/Update Password

**Option A: Reset Existing User Password**
1. Find user `preetivaza_db_user`
2. Click **"Edit"** button
3. Click **"Edit Password"**
4. Choose a **simple password** for testing (NO special characters):
   - Example: `Pass123456` or `simple12345`
5. Click **"Update User"**
6. **Remember this new password!**

**Option B: Create New User** (if user doesn't exist)
1. Click **"Add New Database User"**
2. Username: `rentaladmin`
3. Password: `Test123456` (simple, no special characters)
4. Privileges: "Read and write to any database"
5. Click **"Add User"**

### Step 3: Update Connection String

After you get the correct credentials, I'll update the `.env` file.

---

## Quick Test

Try one of these connection strings (update with YOUR password):

**If you reset preetivaza_db_user password to `Pass123456`:**
```
mongodb+srv://preetivaza_db_user:Pass123456@cluster0.anwl8iu.mongodb.net/HomeEssentialsRentalSystem?retryWrites=true&w=majority
```

**If you created new user rentaladmin with password `Test123456`:**
```
mongodb+srv://rentaladmin:Test123456@cluster0.anwl8iu.mongodb.net/HomeEssentialsRentalSystem?retryWrites=true&w=majority
```

---

## What To Do Next

1. Go to MongoDB Atlas → **Database Access**
2. Either:
   - Reset password for `preetivaza_db_user`, OR
   - Create new user with simple password
3. Reply with:
   ```
   Username: [your username]
   Password: [your new password]
   ```
4. I'll update the connection and test it

---

## Alternative: Get Connection String from Atlas

1. Go to **"Database"** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Copy the new connection string
4. It will have the correct format with your username
5. Just add your password

---

## Common Issues

❌ **Special characters in password** (`_`, `@`, `!`, `#`)
   - Use simple password for testing first
   - Or URL encode special characters

❌ **User doesn't exist**
   - Create new user in Database Access

❌ **Wrong password**
   - Reset password in Database Access

✅ **Solution**: Use simple alphanumeric password for now (letters + numbers only)

---

**Please update your database user password in Atlas, then share the new credentials and I'll configure everything!** 🔧
