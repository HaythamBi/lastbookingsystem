import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthState, User, Booking } from '../types';
import { saveSession, loadSession, clearSession } from '../services/sessionService';
import { API_ENDPOINTS } from '../utils/constants';

interface AppContextType {
  auth: AuthState;
  bookings: Booking[];
  setAuth: (auth: AuthState) => void;
  handleRegistrationComplete: (user: User) => void;
  handleLogout: () => void;
  refreshBookings: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    return loadSession() || {
      isAuthenticated: false,
      user: null,
    };
  });
  const [bookings, setBookings] = useState<Booking[]>([]);

  const refreshBookings = async () => {
    if (!auth.isAuthenticated || !auth.user) return;

    try {
      const response = await fetch(`${API_ENDPOINTS.BOOKINGS}/${auth.user.id}`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      
      const data = await response.json();
      if (data.success) {
        setBookings(data.data.map((booking: any) => ({
          ...booking,
          startTime: new Date(booking.startTime),
          endTime: new Date(booking.endTime)
        })));
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      refreshBookings();
    }
  }, [auth.isAuthenticated, auth.user?.id]);

  const handleLogout = () => {
    clearSession();
    setAuth({
      isAuthenticated: false,
      user: null,
    });
    setBookings([]);
  };

  const handleRegistrationComplete = (user: User) => {
    const newAuth = {
      isAuthenticated: true,
      user,
    };
    setAuth(newAuth);
    saveSession(newAuth);
  };

  return (
    <AppContext.Provider
      value={{
        auth,
        bookings,
        setAuth,
        handleRegistrationComplete,
        handleLogout,
        refreshBookings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}