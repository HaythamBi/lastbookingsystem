import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface BookingTabsProps {
  activeTab: 'calendar' | 'bookings';
  onTabChange: (tab: 'calendar' | 'bookings') => void;
}

export function BookingTabs({ activeTab, onTabChange }: BookingTabsProps) {
  return (
    <div className="md:hidden mb-6">
      <div className="flex rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => onTabChange('calendar')}
          className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 ${
            activeTab === 'calendar'
              ? 'bg-white text-primary shadow'
              : 'text-gray-600'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Book Session</span>
        </button>
        <button
          onClick={() => onTabChange('bookings')}
          className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 ${
            activeTab === 'bookings'
              ? 'bg-white text-primary shadow'
              : 'text-gray-600'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>My Bookings</span>
        </button>
      </div>
    </div>
  );
}