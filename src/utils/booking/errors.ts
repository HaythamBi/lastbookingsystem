export class BookingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BookingError';
  }
}

export class ValidationError extends BookingError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AvailabilityError extends BookingError {
  constructor(message: string) {
    super(message);
    this.name = 'AvailabilityError';
  }
}