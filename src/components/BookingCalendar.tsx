import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { TimeSlot } from '../types';
import { TimeSlotCard } from './TimeSlotCard';
import { formatDate, addDays } from '../utils/dateUtils';

interface BookingCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  timeSlots: TimeSlot[];
  onTimeSlotSelect: (slot: TimeSlot) => void;
}

export function BookingCalendar({
  selectedDate,
  onDateChange,
  timeSlots,
  onTimeSlotSelect,
}: BookingCalendarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => onDateChange(addDays(selectedDate, -1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-base md:text-lg font-semibold">
          {formatDate(selectedDate)}
        </h2>
        <button
          onClick={() => onDateChange(addDays(selectedDate, 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {timeSlots.map((slot, index) => (
          <TimeSlotCard
            key={index}
            slot={slot}
            onSelect={onTimeSlotSelect}
          />
        ))}
      </div>
    </div>
  );
}