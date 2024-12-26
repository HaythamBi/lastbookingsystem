import React from 'react';
import { TimeSlotCard } from './TimeSlotCard';
import type { TimeSlot } from '../../types';

interface TimeSlotListProps {
  slots: TimeSlot[];
  onSelect: (slot: TimeSlot) => void;
}

export function TimeSlotList({ slots, onSelect }: TimeSlotListProps) {
  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No available slots for this date
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {slots.map((slot, index) => (
        <TimeSlotCard
          key={`${slot.startTime.toISOString()}-${index}`}
          slot={slot}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}