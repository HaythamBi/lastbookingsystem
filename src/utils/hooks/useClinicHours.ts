import { useState, useEffect } from 'react';
import { api } from '../api';
import { API_ENDPOINTS } from '../constants';
import { useToast } from '../../contexts/ToastContext';
import type { ClinicHours } from '../../types';

export function useClinicHours(date: Date) {
  const [hours, setHours] = useState<ClinicHours[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchHours = async () => {
      try {
        const response = await api.get<{ data: ClinicHours[] }>(
          `${API_ENDPOINTS.ADMIN}/clinic-hours/month/${date.toISOString()}`
        );
        setHours(response.data);
      } catch (error) {
        showToast('Failed to load clinic hours', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchHours();
  }, [date]);

  const updateHours = async (dateStr: string, updates: Partial<ClinicHours>) => {
    try {
      await api.put(
        `${API_ENDPOINTS.ADMIN}/clinic-hours/date/${dateStr}`,
        updates
      );
      setHours(current => 
        current.map(h => 
          h.date === dateStr ? { ...h, ...updates } : h
        )
      );
      showToast('Hours updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update hours', 'error');
      throw error;
    }
  };

  return { hours, loading, updateHours };
}