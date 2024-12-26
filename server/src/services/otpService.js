import twilio from 'twilio';
import { getDb } from '../config/database.js';
import { addMinutes } from '../utils/dateUtils.js';

const client = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const DEV_MODE = process.env.NODE_ENV === 'development';
const TEST_OTP = '111111';
const OTP_EXPIRY_MINUTES = 5;

export async function generateAndSendOtp(phoneNumber) {
  const db = await getDb();
  const otp = DEV_MODE ? TEST_OTP : generateOtp();
  const expiresAt = addMinutes(new Date(), OTP_EXPIRY_MINUTES);

  try {
    // Store OTP in database
    await db.run(
      `INSERT OR REPLACE INTO otp_codes (phone_number, code, expires_at)
       VALUES (?, ?, ?)`,
      [phoneNumber, otp, expiresAt.toISOString()]
    );

    if (DEV_MODE) {
      console.log(`DEV MODE - OTP for ${phoneNumber}: ${otp}`);
      return true;
    }

    // Send OTP via Twilio
    if (client) {
      const message = await client.messages.create({
        body: `Your verification code is: ${otp}. Valid for ${OTP_EXPIRY_MINUTES} minutes.`,
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: `whatsapp:${phoneNumber}`
      });

      return !!message.sid;
    }

    throw new Error('Twilio client not configured');
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
}

export async function verifyOtp(phoneNumber, code) {
  const db = await getDb();
  
  if (DEV_MODE && code === TEST_OTP) {
    return true;
  }

  try {
    const storedOtp = await db.get(
      `SELECT * FROM otp_codes 
       WHERE phone_number = ? 
       AND code = ?
       AND expires_at > datetime('now')`,
      [phoneNumber, code]
    );

    if (!storedOtp) {
      throw new Error('Invalid or expired OTP');
    }

    // Delete used OTP
    await db.run(
      'DELETE FROM otp_codes WHERE phone_number = ?',
      [phoneNumber]
    );

    return true;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}