export interface User {
  id: string;
  name: string | null;
  phoneNumber: string;
  email?: string;
  role: 'admin' | 'worker' | 'customer';
}

export interface Booking {
  id: string;
  customerId: string;
  workerId?: string;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  machineId: number;
  notes?: string;
  customerName?: string;
  workerName?: string;
}

export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  availableSpots: number;
  bookings: Booking[];
}

export interface BookingConstraints {
  maxBookingsPerWeek: number;
  maxAdvanceBookingDays: number;
  minCancellationHours: number;
  slotsPerTimeSlot: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}