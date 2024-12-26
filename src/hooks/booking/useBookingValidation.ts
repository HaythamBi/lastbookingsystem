import { useState } from 'react';
import { TimeSlot, Booking } from '../../types';
import { validateBooking, validateCancellationRequest } from '../../services/booking/validationService';
import { useToast } from '../../contexts/ToastContext';

export function useBookingValidation() {
  const [validating, setValidating] = useState(false);
  const { showToast } = useToast();

  const validateBookingRequest = async (
    customerId: string,
    slot: TimeSlot
  ): Promise<boolean> => {
    setValidating(true);
    try {
      const result = await validateBooking(customerId, slot);
      if (!result.isValid) {
        showToast(result.error || 'Invalid booking request', 'error');
        return false;
      }
      return true;
    } catch (error) {
      showToast('Validation failed', 'error');
      return false;
    } finally {
      setValidating(false);
    }
  };

  const validateCancellation = async (booking: Booking): Promise<boolean> => {
    setValidating(true);
    try {
      const result = await validateCancellationRequest(booking);
      if (!result.isValid) {
        showToast(result.error || 'Cannot cancel booking', 'error');
        return false;
      }
      return true;
    } catch (error) {
      showToast('Validation failed', 'error');
      return false;
    } finally {
      setValidating(false);
    }
  };

  return {
    validating,
    validateBookingRequest,
    validateCancellation
  };
}