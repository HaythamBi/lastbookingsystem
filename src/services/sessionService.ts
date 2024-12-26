import { AuthState } from '../types';

const SESSION_KEY = 'clinic_session';

export function saveSession(auth: AuthState): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      ...auth,
      timestamp: new Date().getTime()
    }));
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

export function loadSession(): AuthState | null {
  try {
    const savedSession = localStorage.getItem(SESSION_KEY);
    if (!savedSession) return null;

    const session = JSON.parse(savedSession);
    const timestamp = session.timestamp;
    const now = new Date().getTime();
    
    // Session expires after 30 days
    if (now - timestamp > 30 * 24 * 60 * 60 * 1000) {
      clearSession();
      return null;
    }

    // Update timestamp to extend session
    saveSession({
      isAuthenticated: session.isAuthenticated,
      customer: session.customer
    });

    return {
      isAuthenticated: session.isAuthenticated,
      customer: session.customer
    };
  } catch (error) {
    console.error('Error loading session:', error);
    return null;
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
}