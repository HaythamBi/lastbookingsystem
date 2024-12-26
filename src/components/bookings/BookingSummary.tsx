import React from 'react';
import { Calendar, Clock, Monitor } from 'lucide-react';
import { TimeSlot } from '../../types';
import { formatDate, formatTime } from '../../utils/dateUtils';

interface BookingSummaryProps {
  slot: TimeSlot;
}

export function BookingSummary({ slot }: BookingSummaryProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
      <div className="flex items-center gap-2 text-gray-600">
        <Calendar className="h-4 w-4" />
        <span className="font-medium">
          {formatDate(slot.startTime, { 
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </span>
      </div>
      
      <div className="flex items-center gap-2 text-gray-600">
        <Clock className="h-4 w-4" />
        <span>
          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
        </span>
      </div>

      <div className="flex items-center gap-2 text-gray-600">
        <Monitor className="h-4 w-4" />
        <span>Machine #{slot.machineId}</span>
      </div>

      {slot.priority === 'high' && (
        <div className="text-sm text-blue-600 flex items-center gap-1">
          <span className="text-lg">✨</span> 
          Recommended time slot
        </div>
      )}
    </div>
  );
}