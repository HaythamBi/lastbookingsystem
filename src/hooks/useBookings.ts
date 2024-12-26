import { useState } from 'react';
import type { Booking, TimeSlot } from '../types';
import { canBookSlot } from '../utils/bookingUtils';
import { useToast } from '../contexts/ToastContext';

export function useBookings(initialBookings: Booking[] = []) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [pendingBooking, setPendingBooking] = useState<TimeSlot | null>(null);
  const { showToast } = useToast();

  const handleTimeSlotSelect = (slot: TimeSlot, selectedDate: Date) => {
    const { bookable, reason } = canBookSlot(slot, bookings, selectedDate);
    if (!bookable) {
      showToast(reason || 'Cannot book this slot', 'error');
      return;
    }
    setPendingBooking(slot);
  };

  const handleConfirmBooking = (customerId: string) => {
    if (!pendingBooking) return;

    const newBooking = {
      id: crypto.randomUUID(),
      customerId,
      startTime: pendingBooking.startTime,
      endTime: pendingBooking.endTime,
      status: 'confirmed',
      machineId: Math.floor(Math.random() * 2) + 1,
    };

    setBookings([...bookings, newBooking]);
    setPendingBooking(null);
    showToast('Booking confirmed successfully!', 'success');
    return newBooking;
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: 'cancelled' }
          : booking
      )
    );
    showToast('Booking cancelled successfully', 'success');
  };

  return {
    bookings,
    pendingBooking,
    setPendingBooking,
    handleTimeSlotSelect,
    handleConfirmBooking,
    handleCancelBooking,
  };
}