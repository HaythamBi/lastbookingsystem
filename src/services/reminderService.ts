import type { Booking } from '../types';
import { formatDate, formatTime } from '../utils/dateUtils';

export async function scheduleReminder(booking: Booking): Promise<boolean> {
  try {
    const response = await fetch('/api/reminders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingId: booking.id,
        customerId: booking.customerId,
        startTime: booking.startTime,
      }),
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to schedule reminder');
    }
    
    return true;
  } catch (error) {
    console.error('Error scheduling reminder:', error);
    return false;
  }
}