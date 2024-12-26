import React from 'react';
import { Input } from '../common/Input';
import { validatePhoneNumber } from '../../utils/validation';
import { UI_MESSAGES } from '../../utils/constants';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function PhoneInput({ value, onChange, error, disabled }: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (validatePhoneNumber(newValue) || newValue === '') {
      onChange(newValue);
    }
  };

  return (
    <Input
      id="phone"
      type="tel"
      label="Phone Number"
      value={value}
      onChange={handleChange}
      placeholder="+1 (555) 000-0000"
      error={error}
      disabled={disabled}
      required
    />
  );
}