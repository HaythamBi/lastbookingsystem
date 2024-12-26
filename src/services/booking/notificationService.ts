import { Booking } from '../../types';
import { formatDate, formatTime } from '../../utils/dateUtils';

export async function sendBookingConfirmation(booking: Booking): Promise<void> {
  // Implementation for sending booking confirmation
  console.log('Sending booking confirmation:', {
    bookingId: booking.id,
    date: formatDate(booking.startTime),
    time: formatTime(booking.startTime)
  });
}

export async function sendCancellationNotification(booking: Booking): Promise<void> {
  // Implementation for sending cancellation notification
  console.log('Sending cancellation notification:', {
    bookingId: booking.id,
    date: formatDate(booking.startTime),
    time: formatTime(booking.startTime)
  });
}