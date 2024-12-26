import { useState } from 'react';
import type { Customer, AuthState } from '../types';
import { useToast } from '../contexts/ToastContext';
import { verifyOtp } from '../services/api';

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    customer: null,
  });
  const { showToast } = useToast();

  const handleLogin = async (phone: string, otp: string) => {
    try {
      const response = await verifyOtp(phone, otp);
      if (response.success && response.data?.customer) {
        setAuth({
          isAuthenticated: true,
          customer: response.data.customer,
        });
        showToast('Welcome back!', 'success');
        return true;
      }
      return false;
    } catch (error) {
      showToast('Failed to log in', 'error');
      return false;
    }
  };

  const handleLogout = () => {
    setAuth({
      isAuthenticated: false,
      customer: null,
    });
    showToast('Logged out successfully', 'success');
  };

  const handleRegistrationComplete = (customer: Customer) => {
    setAuth({
      isAuthenticated: true,
      customer,
    });
    showToast('Registration successful!', 'success');
  };

  return {
    auth,
    handleLogin,
    handleLogout,
    handleRegistrationComplete,
  };
}