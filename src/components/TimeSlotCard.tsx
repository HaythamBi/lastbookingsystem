import React from 'react';
import { Clock, Users } from 'lucide-react';
import type { TimeSlot } from '../types';
import { formatTime } from '../utils/dateUtils';
import { isSlotBookable } from '../utils/bookingUtils';

interface TimeSlotCardProps {
  slot: TimeSlot;
  onSelect: (slot: TimeSlot) => void;
}

export function TimeSlotCard({ slot, onSelect }: TimeSlotCardProps) {
  const bookable = isSlotBookable(slot);

  return (
    <button
      onClick={() => bookable && onSelect(slot)}
      disabled={!bookable}
      className={`p-4 rounded-lg text-left w-full transition-all transform hover:scale-[1.02] ${
        bookable
          ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-sm hover:shadow'
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
      }`}
    >
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4" />
        <span className="font-medium">{formatTime(slot.startTime)}</span>
      </div>
      <div className="flex items-center space-x-1 text-sm mt-2 opacity-75">
        <Users className="h-4 w-4" />
        <span>
          {slot.availableSpots} {slot.availableSpots === 1 ? 'spot' : 'spots'} left
        </span>
      </div>
    </button>
  );
}