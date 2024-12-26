import { getDb } from '../db/index.js';

// Test OTP is always '123456' for development
const TEST_OTP = '123456';

export async function setupTestData() {
  const db = await getDb();
  
  // Insert test users if they don't exist
  await db.run(
    `INSERT OR IGNORE INTO customers (id, name, phone_number, email)
     VALUES (?, ?, ?, ?)`,
    ['test-user-1', 'John Doe', '+1234567890', 'john@example.com']
  );
}

export function verifyTestOtp(otp) {
  return otp === TEST_OTP;
}