import { BUSINESS_HOURS } from './constants';

export function isWithinBusinessHours(date: Date): boolean {
  const hours = date.getHours();
  return hours >= BUSINESS_HOURS.START && hours < BUSINESS_HOURS.END;
}

export function getBusinessHoursForDate(date: Date): { start: Date; end: Date } {
  const start = new Date(date);
  start.setHours(BUSINESS_HOURS.START, 0, 0, 0);

  const end = new Date(date);
  end.setHours(BUSINESS_HOURS.END, 0, 0, 0);

  return { start, end };
}

export function isValidBookingTime(date: Date): boolean {
  const now = new Date();
  const minBookingTime = new Date(now);
  minBookingTime.setHours(now.getHours() + 2);

  return date > minBookingTime && isWithinBusinessHours(date);
}