import { TimeSlot, Booking } from '../../types';
import { 
  validateTimeSlot,
  validateBookingLimit,
  validateCancellation 
} from '../../utils/booking/validation';
import { BookingValidationResult } from '../../utils/booking/types';

export async function validateBooking(
  customerId: string,
  slot: TimeSlot
): Promise<BookingValidationResult> {
  if (!validateTimeSlot(slot)) {
    return {
      isValid: false,
      error: 'This time slot is not available'
    };
  }

  // Add more validation rules as needed
  return { isValid: true };
}

export async function validateCancellationRequest(
  booking: Booking
): Promise<BookingValidationResult> {
  if (!validateCancellation(booking)) {
    return {
      isValid: false,
      error: 'Bookings can only be cancelled at least 2 hours in advance'
    };
  }

  return { isValid: true };
}