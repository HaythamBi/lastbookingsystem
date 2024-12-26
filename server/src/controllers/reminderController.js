import { scheduleBookingReminders } from '../services/reminderService.js';
import { getDb } from '../config/database.js';

export async function scheduleReminder(req, res) {
  const { bookingId, customerId, startTime } = req.body;

  try {
    const db = await getDb();
    
    // Get booking and customer details
    const [booking, customer] = await Promise.all([
      db.get('SELECT * FROM bookings WHERE id = ?', [bookingId]),
      db.get('SELECT * FROM customers WHERE id = ?', [customerId])
    ]);

    if (!booking || !customer) {
      return res.status(404).json({
        success: false,
        message: 'Booking or customer not found'
      });
    }

    await scheduleBookingReminders(booking, customer);

    res.json({
      success: true,
      message: 'Reminders scheduled successfully'
    });
  } catch (error) {
    console.error('Error scheduling reminder:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule reminder'
    });
  }
}