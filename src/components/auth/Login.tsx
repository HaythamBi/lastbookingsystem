import React, { useState } from 'react';
import { PhoneVerification } from './PhoneVerification';
import type { Customer } from '../../types';
import { verifyOtp } from '../../services/api';

interface LoginProps {
  onLoginComplete: (customer: Customer) => void;
  onSwitchToRegister: () => void;
}

export function Login({ onLoginComplete, onSwitchToRegister }: LoginProps) {
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePhoneVerified = async (phone: string) => {
    setVerifiedPhone(phone);
    try {
      const response = await verifyOtp(phone, '123456');
      if (response.success && response.data?.customer) {
        onLoginComplete(response.data.customer);
      } else if (response.success && response.isNewUser) {
        // User doesn't exist, switch to registration
        onSwitchToRegister();
      } else {
        setError(response.message || 'Failed to log in');
        setVerifiedPhone(null);
      }
    } catch (err) {
      setError('Failed to log in. Please try again.');
      setVerifiedPhone(null);
    }
  };

  if (!verifiedPhone) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please verify your phone number to continue
          </p>
        </div>
        <PhoneVerification 
          onVerificationComplete={handlePhoneVerified}
          error={error}
        />
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Register now
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="animate-pulse">
        <p className="text-sm text-gray-600">Logging you in...</p>
      </div>
    </div>
  );
}