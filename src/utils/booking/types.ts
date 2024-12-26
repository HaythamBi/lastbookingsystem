import { BOOKING_STATUS } from './constants';

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

export interface BookingSlot {
  startTime: Date;
  endTime: Date;
  machineId: number;
  availableSpots: number;
}

export interface BookingValidationResult {
  isValid: boolean;
  error?: string;
}

export interface BusinessHours {
  start: Date;
  end: Date;
  isOpen: boolean;
}