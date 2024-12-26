import React from 'react';
import { formatTime, formatDate } from '../../utils/dateUtils';
import { Button } from '../common/Button';
import type { TimeSlot } from '../../types';

interface BookingConfirmationDialogProps {
  slot: TimeSlot;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function BookingConfirmationDialog({
  slot,
  onConfirm,
  onCancel,
  isSubmitting = false,
}: BookingConfirmationDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Confirm Booking</h3>
        <div className="space-y-3 mb-6">
          <p className="text-gray-600">
            Are you sure you want to book a session for:
          </p>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="font-medium">{formatDate(slot.startTime)}</p>
            <p className="text-gray-600">
              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            onClick={onCancel} 
            fullWidth 
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            fullWidth 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
          </Button>
        </div>
      </div>
    </div>
  );
}