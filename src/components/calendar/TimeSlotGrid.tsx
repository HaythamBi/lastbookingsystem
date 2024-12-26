import React from 'react';
import { Clock } from 'lucide-react';
import type { TimeSlot } from '../../types';
import { formatTime } from '../../utils/dateUtils';
import { generateTimeSlots } from '../../utils/bookingUtils';
import { useApp } from '../../contexts/AppContext';

interface TimeSlotGridProps {
  selectedDate: Date;
  onTimeSlotSelect: (slot: TimeSlot) => void;
  viewMode: 'day' | 'week';
}

export function TimeSlotGrid({ selectedDate, onTimeSlotSelect, viewMode }: TimeSlotGridProps) {
  const { bookings } = useApp();
  const timeSlots = generateTimeSlots(selectedDate, bookings);

  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No available slots for this date
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {timeSlots.map((slot, index) => {
          const isAvailable = slot.availableSpots > 0;

          return (
            <button
              key={`${slot.startTime.toISOString()}-${index}`}
              onClick={() => isAvailable && onTimeSlotSelect(slot)}
              disabled={!isAvailable}
              className={`p-4 rounded-lg text-left transition-all ${
                !isAvailable
                  ? 'bg-amber-50 text-amber-800'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-700 hover:scale-[1.02] shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{formatTime(slot.startTime)}</span>
                </div>
                <div className={`text-sm px-2 py-1 rounded-full ${
                  isAvailable 
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {isAvailable ? (
                    <span>{slot.availableSpots} spots left</span>
                  ) : (
                    <span>Fully booked</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}