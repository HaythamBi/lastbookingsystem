import React from 'react';
import { Clock, Users } from 'lucide-react';
import { TimeSlot } from '../../types';
import { formatTime } from '../../utils/dateUtils';
import { validateTimeSlot } from '../../utils/booking/validation';

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  onSelect: (slot: TimeSlot) => void;
  selectedSlot?: TimeSlot;
}

export function TimeSlotPicker({ slots, onSelect, selectedSlot }: TimeSlotPickerProps) {
  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No available slots for this date
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {slots.map((slot, index) => {
        const isValid = validateTimeSlot(slot);
        const isSelected = selectedSlot?.startTime.getTime() === slot.startTime.getTime();

        return (
          <button
            key={`${slot.startTime.toISOString()}-${index}`}
            onClick={() => isValid && onSelect(slot)}
            disabled={!isValid}
            className={`
              p-4 rounded-lg text-left transition-all transform
              ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
              ${isValid
                ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 hover:scale-[1.02] shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{formatTime(slot.startTime)}</span>
              </div>
              <div className={`text-sm px-2 py-1 rounded-full ${
                slot.availableSpots > 0 
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{slot.availableSpots} spots</span>
                </div>
              </div>
            </div>
            {slot.priority === 'high' && (
              <div className="text-sm text-blue-600 flex items-center gap-1">
                <span className="text-lg">✨</span> 
                Recommended
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}