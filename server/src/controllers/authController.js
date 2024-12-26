import { getDb } from '../config/database.js';
import { randomUUID } from 'crypto';

const DEV_MODE = process.env.NODE_ENV === 'development';
const TEST_OTP = '111111';

export async function sendOtp(req, res) {
  const { phoneNumber } = req.body;
  
  if (!phoneNumber) {
    return res.status(400).json({
      success: false,
      message: 'Phone number is required'
    });
  }
  
  try {
    // In development, always succeed
    res.json({ 
      success: true, 
      message: DEV_MODE ? 'Development mode: Use 111111 as OTP' : 'OTP sent successfully'
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send OTP' 
    });
  }
}

export async function verifyOtp(req, res) {
  const { phoneNumber, otp } = req.body;
  
  if (!phoneNumber || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Phone number and OTP are required'
    });
  }

  try {
    const db = await getDb();
    
    // In development, accept TEST_OTP
    if (DEV_MODE && otp !== TEST_OTP) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid OTP. Use ${TEST_OTP} for testing.`
      });
    }

    // Check if user exists
    const user = await db.get(
      'SELECT * FROM users WHERE phone_number = ?',
      [phoneNumber]
    );

    if (user) {
      // Return existing user
      res.json({ 
        success: true,
        data: { 
          user: {
            id: user.id,
            name: user.name,
            phoneNumber: user.phone_number,
            email: user.email,
            role: user.role
          }
        }
      });
    } else {
      // Signal that registration is needed
      res.json({
        success: true,
        data: { needsRegistration: true }
      });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to verify OTP' 
    });
  }
}

export async function completeRegistration(req, res) {
  const { phoneNumber, name, email } = req.body;

  if (!phoneNumber || !name) {
    return res.status(400).json({
      success: false,
      message: 'Phone number and name are required'
    });
  }

  try {
    const db = await getDb();

    // Check if user already exists
    const existingUser = await db.get(
      'SELECT * FROM users WHERE phone_number = ?',
      [phoneNumber]
    );

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const userId = randomUUID();

    // Create new user
    await db.run(
      `INSERT INTO users (id, phone_number, name, email, role)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, phoneNumber, name, email || null, 'customer']
    );

    // Get created user
    const user = await db.get(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      throw new Error('Failed to create user');
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          phoneNumber: user.phone_number,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Error completing registration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete registration'
    });
  }
}