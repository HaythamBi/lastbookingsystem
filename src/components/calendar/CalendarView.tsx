import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DaySelector } from './DaySelector';
import { TimeSlotGrid } from './TimeSlotGrid';
import { formatDate } from '../../utils/dateUtils';
import type { TimeSlot } from '../../types';
import { Button } from '../common/Button';

interface CalendarViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onTimeSlotSelect: (slot: TimeSlot) => void;
}

export function CalendarView({ selectedDate, onDateChange, onTimeSlotSelect }: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {/* Calendar Header */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => onDateChange(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}
            variant="secondary"
            className="p-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold">
            {formatDate(selectedDate, { weekday: 'long', month: 'long', day: 'numeric' })}
          </h2>
          <Button
            onClick={() => onDateChange(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}
            variant="secondary"
            className="p-2"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setViewMode('day')}
            className={`flex-1 py-2 text-sm font-medium rounded-md ${
              viewMode === 'day' ? 'bg-white text-primary shadow' : 'text-gray-600'
            }`}
          >
            Day View
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`flex-1 py-2 text-sm font-medium rounded-md ${
              viewMode === 'week' ? 'bg-white text-primary shadow' : 'text-gray-600'
            }`}
          >
            Week View
          </button>
        </div>
      </div>

      {/* Day Selector */}
      <DaySelector
        selectedDate={selectedDate}
        onDateSelect={onDateChange}
        viewMode={viewMode}
      />

      {/* Time Slots */}
      <div className="mt-6 overflow-y-auto max-h-[calc(100vh-24rem)]">
        <TimeSlotGrid
          selectedDate={selectedDate}
          onTimeSlotSelect={onTimeSlotSelect}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
}