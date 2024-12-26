const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const AUTH_CONSTANTS = {
  TEST_OTP: '111111',
  MIN_PHONE_LENGTH: 10,
  OTP_LENGTH: 6,
  DEV_MODE: import.meta.env.DEV,
};

export const API_ENDPOINTS = {
  SEND_OTP: `${API_BASE}/auth/send-otp`,
  VERIFY_OTP: `${API_BASE}/auth/verify-otp`,
  COMPLETE_REGISTRATION: `${API_BASE}/auth/complete-registration`,
  BOOKINGS: `${API_BASE}/bookings`,
  ADMIN: `${API_BASE}/admin`
};

export const UI_MESSAGES = {
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_OTP: 'Please enter a valid 6-digit OTP',
  SERVER_ERROR: 'Something went wrong. Please try again.',
  OTP_SENT: 'OTP sent successfully',
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTRATION_SUCCESS: 'Registration successful!',
  NAME_REQUIRED: 'Full name is required',
};