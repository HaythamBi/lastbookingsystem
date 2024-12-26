import { isSameDay } from '../dateUtils';

export function optimizeTimeSlots(slots, bookings) {
  return slots.map(slot => {
    const conflictingBookings = bookings.filter(booking => 
      isSameDay(new Date(booking.startTime), slot.startTime) &&
      booking.status === 'confirmed'
    );

    const availableSpots = Math.max(0, 2 - conflictingBookings.length);
    
    return {
      ...slot,
      availableSpots,
      bookings: conflictingBookings,
      priority: determinePriority(slot, conflictingBookings)
    };
  });
}

function determinePriority(slot, conflictingBookings) {
  // Add logic to determine slot priority based on various factors
  const isPopularTime = slot.startTime.getHours() >= 9 && slot.startTime.getHours() <= 17;
  const hasLowCompetition = conflictingBookings.length === 0;
  
  return isPopularTime && hasLowCompetition ? 'high' : 'normal';
}