import { API_ENDPOINTS } from '../utils/constants';

const defaultHeaders = {
  'Content-Type': 'application/json'
};

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
}

export async function sendOtp(phoneNumber: string) {
  try {
    const response = await fetch(API_ENDPOINTS.SEND_OTP, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ phoneNumber }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send OTP'
    };
  }
}

export async function verifyOtp(phoneNumber: string, otp: string) {
  try {
    const response = await fetch(API_ENDPOINTS.VERIFY_OTP, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ phoneNumber, otp }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to verify OTP'
    };
  }
}