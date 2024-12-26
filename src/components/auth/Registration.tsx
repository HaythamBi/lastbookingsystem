import React, { useState } from 'react';
import { PhoneVerification } from './PhoneVerification';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import type { Customer } from '../../types';

interface RegistrationProps {
  onRegisterComplete: (customer: Customer) => void;
}

export function Registration({ onRegisterComplete }: RegistrationProps) {
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer: Customer = {
      id: crypto.randomUUID(),
      name: formData.name,
      phoneNumber: verifiedPhone!,
      email: formData.email || undefined,
    };
    onRegisterComplete(customer);
  };

  if (!verifiedPhone) {
    return <PhoneVerification onVerificationComplete={setVerifiedPhone} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        label="Full Name"
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Enter your full name"
      />
      <Input
        id="email"
        type="email"
        label="Email (optional)"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Enter your email address"
      />
      <Button type="submit" fullWidth>
        Complete Registration
      </Button>
    </form>
  );
}