import { useCallback } from 'react';
import { Booking } from '../../types';
import { 
  sendBookingConfirmation,
  sendCancellationNotification 
} from '../../services/booking/notificationService';
import { useToast } from '../../contexts/ToastContext';

export function useBookingNotifications() {
  const { showToast } = useToast();

  const notifyBookingConfirmed = useCallback(async (booking: Booking) => {
    try {
      await sendBookingConfirmation(booking);
      showToast('Booking confirmed successfully!', 'success');
    } catch (error) {
      console.error('Failed to send booking confirmation:', error);
    }
  }, [showToast]);

  const notifyBookingCancelled = useCallback(async (booking: Booking) => {
    try {
      await sendCancellationNotification(booking);
      showToast('Booking cancelled successfully', 'success');
    } catch (error) {
      console.error('Failed to send cancellation notification:', error);
    }
  }, [showToast]);

  return {
    notifyBookingConfirmed,
    notifyBookingCancelled
  };
}