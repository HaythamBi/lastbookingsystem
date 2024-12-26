import { TimeSlot, Booking } from '../../types';
import { BOOKING_CONSTRAINTS } from './constants';
import { getBusinessHoursForDate } from './time';
import { getAvailableSpots, getAvailableMachines } from './availability';
import { addMinutes } from '../dateUtils';

export function generateTimeSlots(date: Date, existingBookings: Booking[] = []): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const { start: startTime, end: endTime } = getBusinessHoursForDate(date);

  while (startTime < endTime) {
    const slotEnd = addMinutes(new Date(startTime), BOOKING_CONSTRAINTS.SLOT_DURATION);
    
    const slotBookings = existingBookings.filter(booking => 
      booking.status === 'confirmed' &&
      new Date(booking.startTime).getTime() === startTime.getTime()
    );

    const availableSpots = getAvailableSpots({ 
      startTime: new Date(startTime),
      endTime: slotEnd,
      availableSpots: BOOKING_CONSTRAINTS.SLOTS_PER_MACHINE,
      bookings: slotBookings,
      machineId: 1
    }, existingBookings);

    slots.push({
      startTime: new Date(startTime),
      endTime: slotEnd,
      availableSpots,
      bookings: slotBookings,
      machineId: getAvailableMachines({ 
        startTime: new Date(startTime),
        endTime: slotEnd,
        availableSpots,
        bookings: slotBookings,
        machineId: 1
      })[0] || 1
    });

    startTime.setMinutes(startTime.getMinutes() + BOOKING_CONSTRAINTS.SLOT_DURATION);
  }

  return slots;
}