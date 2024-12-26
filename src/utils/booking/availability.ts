import { TimeSlot, Booking } from '../../types';
import { BOOKING_CONSTRAINTS } from './constants';
import { isValidBookingTime } from './time';

export function getAvailableSpots(slot: TimeSlot, existingBookings: Booking[]): number {
  const conflictingBookings = existingBookings.filter(booking => 
    booking.status === 'confirmed' &&
    new Date(booking.startTime).getTime() === slot.startTime.getTime()
  );

  return Math.max(0, BOOKING_CONSTRAINTS.SLOTS_PER_MACHINE - conflictingBookings.length);
}

export function isSlotAvailable(slot: TimeSlot): boolean {
  return (
    slot.availableSpots > 0 &&
    isValidBookingTime(slot.startTime)
  );
}

export function getAvailableMachines(slot: TimeSlot): number[] {
  const usedMachines = slot.bookings.map(b => b.machineId);
  const availableMachines: number[] = [];

  for (let i = 1; i <= BOOKING_CONSTRAINTS.SLOTS_PER_MACHINE; i++) {
    if (!usedMachines.includes(i)) {
      availableMachines.push(i);
    }
  }

  return availableMachines;
}