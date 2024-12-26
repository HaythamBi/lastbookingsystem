import { TimeSlot, Booking } from '../../types';
import { BOOKING_CONSTRAINTS } from './constants';
import { isValidBookingTime } from './time';

export function validateTimeSlot(slot: TimeSlot): boolean {
  return (
    isValidBookingTime(slot.startTime) &&
    slot.availableSpots > 0
  );
}

export function validateBookingLimit(
  customerId: string, 
  bookings: Booking[]
): boolean {
  const activeBookings = bookings.filter(
    booking => 
      booking.customerId === customerId && 
      booking.status === 'confirmed'
  );
  
  return activeBookings.length < BOOKING_CONSTRAINTS.MAX_BOOKINGS_PER_WEEK;
}

export function validateCancellation(booking: Booking): boolean {
  const now = new Date();
  const bookingStart = new Date(booking.startTime);
  const hoursDifference = (bookingStart.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  return hoursDifference >= BOOKING_CONSTRAINTS.MIN_HOURS_BEFORE_BOOKING;
}