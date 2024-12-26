import React from 'react';
import { Input } from '../common/Input';
import { validateOtp } from '../../utils/validation';
import { AUTH_CONSTANTS } from '../../utils/constants';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function OtpInput({ value, onChange, error, disabled }: OtpInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '');
    if (newValue.length <= AUTH_CONSTANTS.OTP_LENGTH) {
      onChange(newValue);
    }
  };

  return (
    <Input
      id="otp"
      type="text"
      label="Enter OTP"
      value={value}
      onChange={handleChange}
      placeholder="Enter 6-digit code"
      maxLength={AUTH_CONSTANTS.OTP_LENGTH}
      pattern="\d*"
      error={error}
      disabled={disabled}
      required
    />
  );
}