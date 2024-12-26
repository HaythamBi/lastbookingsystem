import React, { useState } from 'react';
import { PhoneInput } from './PhoneInput';
import { OtpInput } from './OtpInput';
import { RegistrationForm } from './RegistrationForm';
import { Button } from '../common/Button';
import { useToast } from '../../contexts/ToastContext';
import { sendOtp, verifyOtp } from '../../services/authService';
import { validatePhoneNumber, validateOtp } from '../../utils/validation';
import { UI_MESSAGES, AUTH_CONSTANTS } from '../../utils/constants';
import type { User } from '../../types';

interface AuthFlowProps {
  onAuthComplete: (user: User) => void;
}

export function AuthFlow({ onAuthComplete }: AuthFlowProps) {
  const [step, setStep] = useState<'phone' | 'otp' | 'registration'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(AUTH_CONSTANTS.DEV_MODE ? AUTH_CONSTANTS.TEST_OTP : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleSendOtp = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError(UI_MESSAGES.INVALID_PHONE);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await sendOtp(phoneNumber);
      if (response.success) {
        setStep('otp');
        showToast(UI_MESSAGES.OTP_SENT, 'success');
        if (AUTH_CONSTANTS.DEV_MODE) {
          showToast(UI_MESSAGES.DEV_MODE_OTP, 'info');
          setOtp(AUTH_CONSTANTS.TEST_OTP);
        }
      } else {
        setError(response.message || UI_MESSAGES.SERVER_ERROR);
      }
    } catch (err) {
      setError(UI_MESSAGES.SERVER_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateOtp(otp)) {
      setError(UI_MESSAGES.INVALID_OTP);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await verifyOtp(phoneNumber, otp);
      if (response.success) {
        if (response.data?.user?.name) {
          // Existing user with name
          showToast(UI_MESSAGES.LOGIN_SUCCESS, 'success');
          onAuthComplete(response.data.user);
        } else {
          // New user or user without name
          setStep('registration');
        }
      } else {
        setError(response.message || UI_MESSAGES.SERVER_ERROR);
      }
    } catch (err) {
      setError(UI_MESSAGES.SERVER_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          {step === 'registration' ? 'Complete Registration' : 'Welcome Back'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {step === 'phone' 
            ? 'Enter your phone number to continue'
            : step === 'otp'
            ? 'Enter the verification code'
            : 'Please provide your details'
          }
        </p>
      </div>

      {step === 'phone' && (
        <>
          <PhoneInput
            value={phoneNumber}
            onChange={setPhoneNumber}
            error={error}
            disabled={loading}
          />
          <Button
            onClick={handleSendOtp}
            fullWidth
            disabled={loading || !phoneNumber}
          >
            {loading ? 'Sending...' : 'Continue'}
          </Button>
        </>
      )}

      {step === 'otp' && (
        <>
          <OtpInput
            value={otp}
            onChange={setOtp}
            error={error}
            disabled={loading}
          />
          <div className="space-y-3">
            <Button
              onClick={handleVerifyOtp}
              fullWidth
              disabled={loading || !otp}
            >
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
            <Button
              onClick={() => {
                setStep('phone');
                setError(null);
              }}
              variant="secondary"
              fullWidth
              disabled={loading}
            >
              Change Phone Number
            </Button>
          </div>
        </>
      )}

      {step === 'registration' && (
        <RegistrationForm
          phoneNumber={phoneNumber}
          onComplete={onAuthComplete}
          onBack={() => setStep('phone')}
        />
      )}
    </div>
  );
}