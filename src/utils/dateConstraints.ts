import { addDays, startOfDay, endOfDay, isBefore, isAfter } from './dateUtils';

export const DATE_CONSTRAINTS = {
  MAX_DAYS_IN_ADVANCE: 14, // 2 weeks
  MIN_HOURS_BEFORE_BOOKING: 2,
} as const;

export function getBookingDateRange() {
  const now = new Date();
  const startDate = startOfDay(now);
  const endDate = endOfDay(addDays(now, DATE_CONSTRAINTS.MAX_DAYS_IN_ADVANCE));
  
  return { startDate, endDate };
}

export function isDateInRange(date: Date): boolean {
  const { startDate, endDate } = getBookingDateRange();
  return !isBefore(date, startDate) && !isAfter(date, endDate);
}

export function isTimeSlotAvailable(startTime: Date): boolean {
  const now = new Date();
  const minBookingTime = addDays(now, 0, DATE_CONSTRAINTS.MIN_HOURS_BEFORE_BOOKING);
  return isAfter(startTime, minBookingTime);
}

export function getAvailableDates(): Date[] {
  const { startDate, endDate } = getBookingDateRange();
  const dates: Date[] = [];
  let currentDate = new Date(startDate);

  while (!isAfter(currentDate, endDate)) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  return dates;
}