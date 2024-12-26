import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { AuthFlow } from '../auth/AuthFlow';

export function AuthScreen() {
  const { handleRegistrationComplete } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <AuthFlow onAuthComplete={handleRegistrationComplete} />
        </div>
      </div>
    </div>
  );
}