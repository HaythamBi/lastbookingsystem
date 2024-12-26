import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useToast } from '../../contexts/ToastContext';
import { completeRegistration } from '../../services/authService';
import { UI_MESSAGES } from '../../utils/constants';
import type { User } from '../../types';

interface RegistrationFormProps {
  phoneNumber: string;
  onComplete: (user: User) => void;
  onBack: () => void;
}

export function RegistrationForm({ phoneNumber, onComplete, onBack }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError(UI_MESSAGES.NAME_REQUIRED);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await completeRegistration(
        phoneNumber,
        formData.name.trim(),
        formData.email.trim() || undefined
      );
      
      if (response.success && response.data?.user) {
        showToast(UI_MESSAGES.REGISTRATION_SUCCESS, 'success');
        onComplete(response.data.user);
      } else {
        throw new Error(response.message || 'Failed to complete registration');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to complete registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        label="Full Name"
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Enter your full name"
        error={error}
        disabled={loading}
      />
      <Input
        id="email"
        type="email"
        label="Email (optional)"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Enter your email address"
        disabled={loading}
      />
      <div className="space-y-3">
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Completing Registration...' : 'Complete Registration'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={onBack}
          disabled={loading}
        >
          Back
        </Button>
      </div>
    </form>
  );
}