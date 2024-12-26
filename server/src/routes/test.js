import express from 'express';
import { generateAndSendOtp, verifyOtp } from '../services/otpService.js';
import { scheduleReminders, processReminders } from '../services/reminderService.js';

const router = express.Router();

// Only enable in development
if (process.env.NODE_ENV === 'development') {
  router.post('/otp/send', async (req, res) => {
    try {
      const { phoneNumber } = req.body;
      await generateAndSendOtp(phoneNumber);
      res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.post('/otp/verify', async (req, res) => {
    try {
      const { phoneNumber, otp } = req.body;
      const isValid = await verifyOtp(phoneNumber, otp);
      res.json({ success: true, valid: isValid });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.post('/reminders/schedule', async (req, res) => {
    try {
      const { booking, customer } = req.body;
      await scheduleReminders(booking, customer);
      res.json({ success: true, message: 'Reminders scheduled' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  router.post('/reminders/process', async (req, res) => {
    try {
      await processReminders();
      res.json({ success: true, message: 'Reminders processed' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
}

export default router;