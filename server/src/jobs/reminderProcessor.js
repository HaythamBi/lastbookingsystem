import { processReminders } from '../services/reminderService.js';

const REMINDER_CHECK_INTERVAL = 60 * 1000; // Check every minute

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