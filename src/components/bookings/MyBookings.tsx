import React from 'react';
import { Clock, Calendar, X, AlertCircle } from 'lucide-react';
import type { Booking, Customer } from '../../types';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { canCancelBooking } from '../../utils/bookingUtils';

interface MyBookingsProps {
  customer: Customer;
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
}

export function MyBookings({ customer, bookings, onCancelBooking }: MyBookingsProps) {
  const activeBookings = bookings.filter(
    (booking) => booking.status !== 'cancelled' && booking.status !== 'completed'
  );

  if (activeBookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <div className="flex flex-col items-center space-y-3">
          <Calendar className="h-12 w-12 text-gray-400" />
          <p className="text-gray-500">You don't have any active bookings</p>
          <p className="text-sm text-gray-400">
            Book a session to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
      <div className="space-y-3">
        {activeBookings.map((booking) => {
          const canCancel = canCancelBooking(booking);
          
          return (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-sm p-4 transition-all hover:shadow"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{formatDate(booking.startTime)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </span>
                  </div>
                </div>
                {canCancel ? (
                  <button
                    onClick={() => onCancelBooking(booking.id)}
                    className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                    title="Cancel booking"
                  >
                    <X className="h-5 w-5" />
                  </button>
                ) : (
                  <div className="flex items-center text-amber-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>Can't cancel</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}