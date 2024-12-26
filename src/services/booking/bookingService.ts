import { TimeSlot, Booking } from '../../types';
import { api } from '../../utils/api';
import { API_ENDPOINTS } from '../../utils/constants';
import { validateBooking } from './validationService';
import { BookingError } from '../../utils/booking/errors';

export async function createBooking(
  customerId: string,
  slot: TimeSlot
): Promise<Booking> {
  const validationResult = await validateBooking(customerId, slot);
  if (!validationResult.isValid) {
    throw new BookingError(validationResult.error || 'Invalid booking');
  }

  try {
    const response = await api.post<{ data: Booking }>(
      API_ENDPOINTS.BOOKINGS,
      {
        customerId,
        startTime: slot.startTime.toISOString(),
        endTime: slot.endTime.toISOString(),
        machineId: slot.machineId,
      }
    );
    return response.data;
  } catch (error) {
    throw new BookingError(
      error instanceof Error ? error.message : 'Failed to create booking'
    );
  }
}

export async function cancelBooking(
  bookingId: string,
  customerId: string
): Promise<void> {
  try {
    await api.post(
      `${API_ENDPOINTS.BOOKINGS}/${bookingId}/cancel`,
      { customerId }
    );
  } catch (error) {
    throw new BookingError(
      error instanceof Error ? error.message : 'Failed to cancel booking'
    );
  }
}