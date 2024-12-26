export function validatePhoneNumber(phone: string): boolean {
  return /^\+?[\d\s-]{10,}$/.test(phone);
}

export function validateOtp(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}