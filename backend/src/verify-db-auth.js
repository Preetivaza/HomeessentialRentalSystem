import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const verifyDatabaseAuth = async () => {
  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('    DATABASE AUTHENTICATION VERIFICATION');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    // Connection options with authentication
    const options = {
      authSource: 'admin',
      maxPoolSize: 5,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      ssl: true,
      tls: true,
      retryWrites: true,
      w: 'majority',
    };

    console.log('🔄 Attempting to connect to MongoDB Atlas...\n');

    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log('✅ CONNECTION SUCCESSFUL!\n');
    console.log('───────────────────────────────────────────────────────────');
    console.log('📊 Connection Details:');
    console.log('───────────────────────────────────────────────────────────');
    console.log(`  Host:     ${conn.connection.host}`);
    console.log(`  Database: ${conn.connection.name}`);
    console.log(`  Port:     ${conn.connection.port}`);
    console.log(`  Ready:    ${conn.connection.readyState === 1 ? 'Yes ✅' : 'No ❌'}`);
    console.log('───────────────────────────────────────────────────────────\n');

    console.log('🔐 Security Features:');
    console.log('───────────────────────────────────────────────────────────');
    console.log('  SSL/TLS Encryption:    ✅ Enabled');
    console.log('  Authentication Source: admin');
    console.log('  Write Concern:         majority');
    console.log('  Retry Writes:          ✅ Enabled');
    console.log('  Connection Pooling:    ✅ Active (1-5 connections)');
    console.log('───────────────────────────────────────────────────────────\n');

    // Test database operations
    console.log('🧪 Testing Database Operations:\n');

    // 1. List collections
    console.log('  → Fetching collections...');
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`  ✅ Collections found: ${collections.length}`);
    if (collections.length > 0) {
      collections.forEach((col, index) => {
        console.log(`     ${index + 1}. ${col.name}`);
      });
    } else {
      console.log('     (No collections yet - will be created automatically)');
    }
    console.log('');

    // 2. Test write permission
    console.log('  → Testing write permissions...');
    const testCollectionName = '__auth_test__';
    await conn.connection.db.collection(testCollectionName).insertOne({ 
      test: true, 
      timestamp: new Date() 
    });
    console.log('  ✅ Write permission verified');
    console.log('');

    // 3. Test read permission
    console.log('  → Testing read permissions...');
    const testDoc = await conn.connection.db.collection(testCollectionName).findOne({ test: true });
    console.log('  ✅ Read permission verified');
    console.log('');

    // 4. Test delete permission
    console.log('  → Testing delete permissions...');
    await conn.connection.db.collection(testCollectionName).deleteOne({ test: true });
    console.log('  ✅ Delete permission verified');
    console.log('');

    // 5. Clean up test collection
    console.log('  → Cleaning up test data...');
    await conn.connection.db.collection(testCollectionName).drop().catch(() => {});
    console.log('  ✅ Cleanup completed');
    console.log('');

    // Get database stats
    console.log('📈 Database Statistics:');
    console.log('───────────────────────────────────────────────────────────');
    const stats = await conn.connection.db.stats();
    console.log(`  Collections:  ${stats.collections}`);
    console.log(`  Indexes:      ${stats.indexes}`);
    console.log(`  Data Size:    ${(stats.dataSize / 1024).toFixed(2)} KB`);
    console.log(`  Storage Size: ${(stats.storageSize / 1024).toFixed(2)} KB`);
    console.log('───────────────────────────────────────────────────────────\n');

    // Connection pool info
    console.log('🔌 Connection Pool Status:');
    console.log('───────────────────────────────────────────────────────────');
    console.log(`  Active:   ${conn.connection.client.s.activeSessions.size}`);
    console.log(`  Total:    ${conn.connection.client.s.sessionPool.sessions.length}`);
    console.log('───────────────────────────────────────────────────────────\n');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('    ✅ ALL AUTHENTICATION CHECKS PASSED');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('Your database is properly authenticated and ready to use!');
    console.log('All CRUD operations verified successfully.\n');

    // Close connection
    await mongoose.connection.close();
    console.log('🔒 Connection closed gracefully.\n');
    process.exit(0);

  } catch (error) {
    console.log('❌ CONNECTION FAILED!\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('    ERROR DETAILS');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.error(`Error Type: ${error.name}`);
    console.error(`Message: ${error.message}\n`);

    if (error.name === 'MongoServerError') {
      if (error.code === 18) {
        console.log('🔑 Authentication Error (Code 18)');
        console.log('───────────────────────────────────────────────────────────');
        console.log('The username or password is incorrect.\n');
        console.log('Solutions:');
        console.log('  1. Go to MongoDB Atlas → Database Access');
        console.log('  2. Verify your database user exists');
        console.log('  3. Reset the password if needed');
        console.log('  4. Update the MONGO_URI in your .env file\n');
      } else if (error.code === 8000) {
        console.log('🔐 Authorization Error (Code 8000)');
        console.log('───────────────────────────────────────────────────────────');
        console.log('User does not have required permissions.\n');
        console.log('Solutions:');
        console.log('  1. Go to MongoDB Atlas → Database Access');
        console.log('  2. Edit user permissions');
        console.log('  3. Grant "Read and write to any database" role\n');
      }
    } else if (error.name === 'MongoNetworkError' || error.message.includes('ETIMEDOUT')) {
      console.log('🌐 Network Error');
      console.log('───────────────────────────────────────────────────────────');
      console.log('Cannot reach MongoDB Atlas cluster.\n');
      console.log('Solutions:');
      console.log('  1. Check your internet connection');
      console.log('  2. Go to MongoDB Atlas → Network Access');
      console.log('  3. Add your IP address to the whitelist');
      console.log('  4. Or allow access from anywhere (0.0.0.0/0)\n');
    }

    console.log('═══════════════════════════════════════════════════════════\n');
    process.exit(1);
  }
};

verifyDatabaseAuth();
