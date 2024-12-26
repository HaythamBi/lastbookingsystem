import { useState, useCallback } from 'react';
import { api } from '../api';
import { API_ENDPOINTS } from '../constants';
import { useToast } from '../../contexts/ToastContext';
import type { Booking } from '../../types';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchBookings = useCallback(async (customerId: string) => {
    try {
      setLoading(true);
      const response = await api.get<{ data: Booking[] }>(
        `${API_ENDPOINTS.BOOKINGS}/${customerId}`
      );
      setBookings(response.data);
    } catch (error) {
      showToast('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = async (bookingData: Partial<Booking>) => {
    try {
      const response = await api.post<{ data: Booking }>(
        API_ENDPOINTS.BOOKINGS,
        bookingData
      );
      setBookings(current => [...current, response.data]);
      showToast('Booking created successfully', 'success');
      return response.data;
    } catch (error) {
      showToast('Failed to create booking', 'error');
      throw error;
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      await api.post(`${API_ENDPOINTS.BOOKINGS}/${bookingId}/cancel`, {});
      setBookings(current =>
        current.map(b =>
          b.id === bookingId ? { ...b, status: 'cancelled' } : b
        )
      );
      showToast('Booking cancelled successfully', 'success');
    } catch (error) {
      showToast('Failed to cancel booking', 'error');
      throw error;
    }
  };

  return {
    bookings,
    loading,
    fetchBookings,
    createBooking,
    cancelBooking,
  };
}