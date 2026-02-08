// backend/src/test-db.ts
import 'dotenv/config';
import { connectDB, disconnectDB } from './db/prisma.js';

async function testConnection() {
  try {
    await connectDB();
    console.log('✅ Database test successful!');
    await disconnectDB();
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }
}

testConnection();