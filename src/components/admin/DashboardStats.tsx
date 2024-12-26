import React from 'react';
import { Users, Calendar, Clock } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    totalBookings: number;
    todayBookings: number;
    activeWorkers: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statItems = [
    {
      label: 'Total Active Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      label: "Today's Bookings",
      value: stats.todayBookings,
      icon: Clock,
      color: 'bg-green-500',
    },
    {
      label: 'Active Workers',
      value: stats.activeWorkers,
      icon: Users,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="bg-white overflow-hidden rounded-lg shadow"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 rounded-md p-3 ${item.color}`}>
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {item.label}
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {item.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}