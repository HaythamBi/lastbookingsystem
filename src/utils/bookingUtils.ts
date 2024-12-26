import type { TimeSlot, BookingConstraints, Booking } from '../types';
import { isTimeSlotAvailable } from './dateConstraints';

export const BOOKING_CONSTRAINTS: BookingConstraints = {
  maxBookingsPerWeek: 3,
  maxAdvanceBookingDays: 14,
  minCancellationHours: 10,
  slotsPerTimeSlot: 2,
};

const CLINIC_HOURS = {
  start: 9, // 9 AM
  end: 17, // 5 PM
  slotDurationMinutes: 30,
} as const;

export function generateTimeSlots(date: Date, existingBookings: Booking[] = []): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startDate = new Date(date);
  startDate.setHours(CLINIC_HOURS.start, 0, 0, 0);

  while (startDate.getHours() < CLINIC_HOURS.end) {
    const endTime = new Date(startDate);
    endTime.setMinutes(startDate.getMinutes() + CLINIC_HOURS.slotDurationMinutes);

    // Only add future time slots
    if (isTimeSlotAvailable(startDate)) {
      // Get bookings for this time slot
      const slotBookings = existingBookings.filter(booking => 
        booking.status === 'confirmed' &&
        new Date(booking.startTime).getTime() === startDate.getTime()
      );

      slots.push({
        startTime: new Date(startDate),
        endTime: new Date(endTime),
        availableSpots: Math.max(0, BOOKING_CONSTRAINTS.slotsPerTimeSlot - slotBookings.length),
        bookings: slotBookings,
      });
    }

    startDate.setMinutes(startDate.getMinutes() + CLINIC_HOURS.slotDurationMinutes);
  }

  return slots;
}

export function isSlotBookable(slot: TimeSlot): boolean {
  return slot.availableSpots > 0 && isTimeSlotAvailable(slot.startTime);
}

export function canCancelBooking(booking: Booking): boolean {
  const now = new Date();
  const bookingStart = new Date(booking.startTime);
  const hoursDifference = (bookingStart.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  return (
    booking.status === 'confirmed' &&
    hoursDifference >= BOOKING_CONSTRAINTS.minCancellationHours
  );
}