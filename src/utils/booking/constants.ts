export const BOOKING_CONSTRAINTS = {
  SLOT_DURATION: 30, // 30 minutes per slot
  SLOTS_PER_MACHINE: 2,
  MAX_BOOKINGS_PER_WEEK: 3,
  MIN_HOURS_BEFORE_BOOKING: 2,
  MAX_ADVANCE_BOOKING_DAYS: 14
} as const;

export const BUSINESS_HOURS = {
  START: 9, // 9 AM
  END: 17, // 5 PM
} as const;

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;