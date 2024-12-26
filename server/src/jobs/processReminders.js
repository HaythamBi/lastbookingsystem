import { processReminders } from '../services/reminderService.js';

// Process reminders every minute
const REMINDER_CHECK_INTERVAL = 60 * 1000;

export function startReminderProcessor() {
  console.log('Starting reminder processor...');
  
  setInterval(async () => {
    try {
      await processReminders();
    } catch (error) {
      console.error('Error processing reminders:', error);
    }
  }, REMINDER_CHECK_INTERVAL);
}