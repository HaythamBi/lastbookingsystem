import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addDays, formatDate, isToday } from '../../utils/dateUtils';
import { TimeSlotList } from '../bookings/TimeSlotList';
import { Button } from '../common/Button';
import type { TimeSlot } from '../../types';
import { generateTimeSlots } from '../../utils/bookingUtils';

interface WeekViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onTimeSlotSelect: (slot: TimeSlot) => void;
}

export function WeekView({ selectedDate, onDateChange, onTimeSlotSelect }: WeekViewProps) {
  // Generate array of dates for the week
  const weekDates = Array.from({ length: 7 }, (_, i) => 
    addDays(getStartOfWeek(selectedDate), i)
  );

  const handlePrevWeek = () => {
    onDateChange(addDays(getStartOfWeek(selectedDate), -7));
  };

  const handleNextWeek = () => {
    onDateChange(addDays(getStartOfWeek(selectedDate), 7));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={handlePrevWeek}
          variant="secondary"
          className="p-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold">
          {formatDate(weekDates[0], { month: 'long', year: 'numeric' })}
        </h2>
        <Button
          onClick={handleNextWeek}
          variant="secondary"
          className="p-2"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDates.map((date) => (
          <div key={date.toISOString()} className="space-y-2">
            <div 
              className={`text-center p-2 rounded-lg ${
                isToday(date) 
                  ? 'bg-primary text-white' 
                  : 'text-gray-600'
              }`}
            >
              <div className="text-sm font-medium">
                {formatDate(date, { weekday: 'short' })}
              </div>
              <div className={`text-lg ${isToday(date) ? 'font-bold' : ''}`}>
                {formatDate(date, { day: 'numeric' })}
              </div>
            </div>
            <div className="h-[calc(100vh-16rem)] overflow-y-auto">
              <TimeSlotList
                slots={generateTimeSlots(date)}
                onSelect={onTimeSlotSelect}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}