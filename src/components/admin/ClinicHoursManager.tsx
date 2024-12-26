import React, { useState, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../common/Button';
import { useToast } from '../../contexts/ToastContext';
import { useApp } from '../../contexts/AppContext';
import { API_ENDPOINTS } from '../../utils/constants';
import { formatDate, addMonths } from '../../utils/dateUtils';

interface ClinicHours {
  date: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface MonthHours {
  [date: string]: ClinicHours;
}

export function ClinicHoursManager() {
  const { auth } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [monthHours, setMonthHours] = useState<MonthHours>({});
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchMonthHours(selectedMonth);
  }, [selectedMonth]);

  const fetchMonthHours = async (date: Date) => {
    if (!auth.user?.id) return;

    try {
      const response = await fetch(
        `${API_ENDPOINTS.ADMIN}/clinic-hours/month/${date.toISOString()}`,
        {
          headers: {
            'X-User-Id': auth.user.id
          }
        }
      );
      const data = await response.json();
      if (data.success) {
        setMonthHours(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showToast('Failed to load clinic hours', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (date: string, updates: Partial<ClinicHours>) => {
    if (!auth.user?.id) return;

    try {
      const response = await fetch(
        `${API_ENDPOINTS.ADMIN}/clinic-hours/date/${date}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': auth.user.id
          },
          body: JSON.stringify(updates),
        }
      );

      const data = await response.json();
      if (data.success) {
        setMonthHours(prev => ({
          ...prev,
          [date]: { ...prev[date], ...data.data }
        }));
        showToast('Hours updated successfully', 'success');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to update hours',
        'error'
      );
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }

    return days;
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const days = getDaysInMonth(selectedMonth);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Clinic Hours</h3>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              onClick={() => setSelectedMonth(addMonths(selectedMonth, -1))}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-lg font-medium">
              {formatDate(selectedMonth, { month: 'long', year: 'numeric' })}
            </span>
            <Button
              variant="secondary"
              onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {days.map((date) => {
            const dateStr = date.toISOString().split('T')[0];
            const hours = monthHours[dateStr] || {
              isOpen: true,
              openTime: '09:00',
              closeTime: '17:00'
            };

            return (
              <div
                key={dateStr}
                className="border rounded-lg p-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">
                    {formatDate(date, { day: 'numeric' })}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={hours.isOpen}
                      onChange={(e) => handleUpdate(dateStr, { 
                        isOpen: e.target.checked 
                      })}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                {hours.isOpen && (
                  <div className="space-y-2">
                    <input
                      type="time"
                      value={hours.openTime}
                      onChange={(e) => handleUpdate(dateStr, { 
                        openTime: e.target.value 
                      })}
                      className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <input
                      type="time"
                      value={hours.closeTime}
                      onChange={(e) => handleUpdate(dateStr, { 
                        closeTime: e.target.value 
                      })}
                      className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}