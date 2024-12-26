import React from 'react';
import { formatDate, isToday } from '../../utils/dateUtils';
import { getAvailableDates } from '../../utils/dateConstraints';

interface DaySelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  viewMode: 'day' | 'week';
}

export function DaySelector({ selectedDate, onDateSelect, viewMode }: DaySelectorProps) {
  const availableDates = getAvailableDates();

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex space-x-2 min-w-max">
        {availableDates.map((date) => (
          <button
            key={date.toISOString()}
            onClick={() => onDateSelect(date)}
            className={`flex flex-col items-center p-2 rounded-lg min-w-[4.5rem] transition-all ${
              date.toDateString() === selectedDate.toDateString()
                ? 'bg-primary text-white'
                : isToday(date)
                ? 'bg-blue-50 text-primary'
                : 'hover:bg-gray-50'
            }`}
          >
            <span className="text-xs font-medium">
              {formatDate(date, { weekday: 'short' })}
            </span>
            <span className={`text-lg ${
              date.toDateString() === selectedDate.toDateString() || isToday(date)
                ? 'font-bold'
                : ''
            }`}>
              {formatDate(date, { day: 'numeric' })}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}