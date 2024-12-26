import { useState } from 'react';
import { TimeSlot } from '../types';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { API_ENDPOINTS } from '../utils/constants';
import { validateTimeSlot, validateBookingLimit, validateCancellation } from '../utils/booking/validation';

export function useBookingFlow() {
  const { auth, bookings, refreshBookings } = useApp();
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pendingBooking, setPendingBooking] = useState<TimeSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    if (!validateTimeSlot(slot)) {
      showToast('This time slot is not available', 'error');
      return;
    }

    if (!validateBookingLimit(auth.user!.id, bookings)) {
      showToast('You have reached your weekly booking limit', 'error');
      return;
    }

    setPendingBooking(slot);
  };

  const handleConfirmBooking = async () => {
    if (!pendingBooking || !auth.user) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(API_ENDPOINTS.BOOKINGS, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Id': auth.user.id
        },
        body: JSON.stringify({
          customerId: auth.user.id,
          startTime: pendingBooking.startTime.toISOString(),
          endTime: pendingBooking.endTime.toISOString(),
          machineId: pendingBooking.machineId,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        showToast('Booking confirmed successfully!', 'success');
        await refreshBookings();
        setPendingBooking(null);
      } else {
        throw new Error(data.message || 'Failed to create booking');
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to create booking', 
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!auth.user) return;

    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    if (!validateCancellation(booking)) {
      showToast('Bookings can only be cancelled at least 2 hours in advance', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.BOOKINGS}/${bookingId}/cancel`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Id': auth.user.id
        },
        body: JSON.stringify({ customerId: auth.user.id }),
      });

      const data = await response.json();
      
      if (data.success) {
        showToast('Booking cancelled successfully', 'success');
        await refreshBookings();
      } else {
        throw new Error(data.message || 'Failed to cancel booking');
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to cancel booking', 
        'error'
      );
    }
  };

  const clearPendingBooking = () => setPendingBooking(null);

  return {
    selectedDate,
    setSelectedDate,
    pendingBooking,
    isSubmitting,
    handleTimeSlotSelect,
    handleConfirmBooking,
    handleCancelBooking,
    clearPendingBooking,
  };
}