import React, { useState } from 'react';
import { Layout } from '../Layout';
import { CalendarView } from '../calendar/CalendarView';
import { MyBookings } from '../bookings/MyBookings';
import { BookingConfirmationDialog } from '../bookings/BookingConfirmationDialog';
import { BookingTabs } from '../bookings/BookingTabs';
import { useBookingFlow } from '../../hooks/useBookingFlow';

export function BookingScreen() {
  const {
    selectedDate,
    setSelectedDate,
    pendingBooking,
    isSubmitting,
    handleTimeSlotSelect,
    handleConfirmBooking,
    handleCancelBooking,
    clearPendingBooking,
  } = useBookingFlow();

  const [activeTab, setActiveTab] = useState<'calendar' | 'bookings'>('calendar');

  return (
    <Layout>
      {pendingBooking && (
        <BookingConfirmationDialog
          slot={pendingBooking}
          onConfirm={handleConfirmBooking}
          onCancel={clearPendingBooking}
          isSubmitting={isSubmitting}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <BookingTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`lg:col-span-2 ${
            activeTab === 'calendar' ? 'block' : 'hidden lg:block'
          }`}>
            <CalendarView
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onTimeSlotSelect={handleTimeSlotSelect}
            />
          </div>
          <div className={activeTab === 'bookings' ? 'block' : 'hidden lg:block'}>
            <MyBookings onCancelBooking={handleCancelBooking} />
          </div>
        </div>
      </div>
    </Layout>
  );
}