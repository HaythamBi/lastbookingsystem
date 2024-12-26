import React from 'react';
import { useApp } from '../contexts/AppContext';
import { AuthScreen } from './screens/AuthScreen';
import { BookingScreen } from './screens/BookingScreen';
import { AdminDashboard } from './admin/AdminDashboard';

export function AppRouter() {
  const { auth } = useApp();

  if (!auth.isAuthenticated) {
    return <AuthScreen />;
  }

  // Route to admin dashboard if user is admin
  if (auth.user?.role === 'admin') {
    return <AdminDashboard />;
  }

  // Regular user booking screen
  return <BookingScreen />;
}