import express from 'express';
import { sendOtp, verifyOtp, completeRegistration } from '../controllers/authController.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/complete-registration', completeRegistration);

export default router;