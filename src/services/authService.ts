import { API_ENDPOINTS } from '../utils/constants';
import type { User } from '../types';

interface AuthResponse {
  success: boolean;
  data?: {
    user?: User;
    needsRegistration?: boolean;
  };
  message?: string;
}

export async function sendOtp(phoneNumber: string): Promise<AuthResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.SEND_OTP, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send OTP');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send OTP',
    };
  }
}

export async function verifyOtp(phoneNumber: string, otp: string): Promise<AuthResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.VERIFY_OTP, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, otp }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to verify OTP');
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to verify OTP',
    };
  }
}

export async function completeRegistration(
  phoneNumber: string,
  name: string,
  email?: string
): Promise<AuthResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.COMPLETE_REGISTRATION, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, name, email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to complete registration');
    }

    return await response.json();
  } catch (error) {
    console.error('Error completing registration:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to complete registration',
    };
  }
}