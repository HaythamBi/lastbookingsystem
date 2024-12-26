import express from 'express';
import { scheduleReminder } from '../controllers/reminderController.js';

const router = express.Router();

router.post('/', scheduleReminder);

export default router;