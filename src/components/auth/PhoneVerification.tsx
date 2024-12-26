import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { sendOtp, verifyOtp } from '../../services/api';

interface PhoneVerificationProps {
  onVerificationComplete: (phoneNumber: string) => void;
}

export function PhoneVerification({ onVerificationComplete }: PhoneVerificationProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phoneNumber.match(/^\+?[\d\s-]{10,}$/)) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await sendOtp(phoneNumber);
      if (response.success) {
        setStep('otp');
        setError('For testing, use 123456 as OTP');
      } else {
        setError(response.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.match(/^\d{6}$/)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await verifyOtp(phoneNumber, otp);
      if (response.success) {
        onVerificationComplete(phoneNumber);
      } else {
        setError(response.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {step === 'phone' ? (
        <>
          <Input
            id="phone"
            type="tel"
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1 (555) 000-0000"
            error={error}
            disabled={loading}
          />
          <Button onClick={handleSendOtp} fullWidth disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </Button>
        </>
      ) : (
        <div className="space-y-4">
          <Input
            id="otp"
            type="text"
            label="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
            pattern="\d*"
            error={error}
            disabled={loading}
          />
          <Button onClick={handleVerifyOtp} fullWidth disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
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
      )}
    </div>
  );
}