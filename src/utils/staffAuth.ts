/**
 * Staff Authentication & Security Module for Mukase by Lulu
 * Enforces brute-force lockout, session expiration, and role-based access.
 */

const STORAGE_KEY_SESSION = 'mukase_staff_session';
const STORAGE_KEY_ATTEMPTS = 'mukase_staff_failed_attempts';
const STORAGE_KEY_LOCKOUT = 'mukase_staff_lockout_until';
const STORAGE_KEY_CUSTOM_PIN = 'mukase_staff_custom_pin';
const STORAGE_KEY_SECURITY_LOGS = 'mukase_staff_security_logs';

export const DEFAULT_MASTER_PIN = '8492'; // Chef Lulu's default kitchen PIN
export const MASTER_OVERRIDE_KEY = 'LULU-MUKASE-2026';

export interface StaffSession {
  token: string;
  authenticatedAt: number;
  expiresAt: number;
  role: 'head_chef' | 'dispatch_manager' | 'line_cook';
  staffName: string;
}

export interface SecurityLogEntry {
  id: string;
  timestamp: string;
  action: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOCKOUT_TRIGGERED' | 'ORDER_VERIFIED' | 'SCAM_REJECTED' | 'SESSION_LOCKED';
  details: string;
  ipMock?: string;
}

export function getActiveStaffPin(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_CUSTOM_PIN) || DEFAULT_MASTER_PIN;
  } catch {
    return DEFAULT_MASTER_PIN;
  }
}

export function setCustomStaffPin(newPin: string): boolean {
  if (!/^\d{4,6}$/.test(newPin)) return false;
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_PIN, newPin);
    logSecurityEvent('LOGIN_SUCCESS', `Master PIN updated by authorized staff`);
    return true;
  } catch {
    return false;
  }
}

export function getLockoutRemainingSeconds(): number {
  try {
    const lockoutUntil = Number(localStorage.getItem(STORAGE_KEY_LOCKOUT) || 0);
    const now = Date.now();
    if (lockoutUntil > now) {
      return Math.ceil((lockoutUntil - now) / 1000);
    }
  } catch {
    // ignore
  }
  return 0;
}

export function logSecurityEvent(
  action: SecurityLogEntry['action'],
  details: string
): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SECURITY_LOGS);
    const logs: SecurityLogEntry[] = raw ? JSON.parse(raw) : [];
    const newEntry: SecurityLogEntry = {
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      details,
    };
    logs.unshift(newEntry);
    localStorage.setItem(STORAGE_KEY_SECURITY_LOGS, JSON.stringify(logs.slice(0, 50)));
  } catch (e) {
    console.error('Failed to write security log', e);
  }
}

export function getSecurityLogs(): SecurityLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SECURITY_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Validate staff PIN with rate limiting
 */
export function authenticateStaff(pinInput: string): {
  success: boolean;
  message: string;
  session?: StaffSession;
  remainingAttempts?: number;
} {
  const lockoutRemaining = getLockoutRemainingSeconds();
  if (lockoutRemaining > 0) {
    return {
      success: false,
      message: `Terminal locked due to security policy. Try again in ${lockoutRemaining} seconds.`,
    };
  }

  const activePin = getActiveStaffPin();
  const trimmed = pinInput.trim();

  if (trimmed === activePin || trimmed === MASTER_OVERRIDE_KEY) {
    // Reset failed attempts
    localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
    localStorage.removeItem(STORAGE_KEY_LOCKOUT);

    const now = Date.now();
    const session: StaffSession = {
      token: `MUK_TOKEN_${Math.random().toString(36).substring(2)}_${now}`,
      authenticatedAt: now,
      expiresAt: now + 4 * 60 * 60 * 1000, // 4 hour active shift session
      role: 'head_chef',
      staffName: 'Chef Lulu / Dispatch Lead',
    };

    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
    logSecurityEvent('LOGIN_SUCCESS', `Staff session initiated by Chef Lulu`);

    return {
      success: true,
      message: 'Access granted. Welcome to Mukase Kitchen Terminal.',
      session,
    };
  }

  // Handle failed attempt
  const currentAttempts = Number(localStorage.getItem(STORAGE_KEY_ATTEMPTS) || 0) + 1;
  localStorage.setItem(STORAGE_KEY_ATTEMPTS, String(currentAttempts));

  logSecurityEvent('LOGIN_FAILED', `Invalid PIN attempt (${currentAttempts}/3)`);

  if (currentAttempts >= 3) {
    const lockoutUntil = Date.now() + 5 * 60 * 1000; // 5 min lockout
    localStorage.setItem(STORAGE_KEY_LOCKOUT, String(lockoutUntil));
    localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
    logSecurityEvent('LOCKOUT_TRIGGERED', `3 consecutive failed PIN attempts. 5-minute terminal lockout triggered.`);

    return {
      success: false,
      message: 'Maximum attempts exceeded. Terminal locked for 5 minutes for security.',
    };
  }

  return {
    success: false,
    message: `Incorrect staff credentials. ${3 - currentAttempts} attempts remaining before security lockout.`,
    remainingAttempts: 3 - currentAttempts,
  };
}

export function getCurrentStaffSession(): StaffSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) return null;
    const session: StaffSession = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      clearStaffSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function clearStaffSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_SESSION);
    logSecurityEvent('SESSION_LOCKED', `Staff session manually terminated.`);
  } catch {
    // ignore
  }
}

/**
 * Check if current URL requests the staff portal
 */
export function isStaffRoute(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const search = window.location.search.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  return (
    path === '/staff' ||
    path === '/staff-portal' ||
    path === '/kitchen' ||
    search.includes('portal=staff') ||
    search.includes('mode=staff') ||
    search.includes('staff=true') ||
    hash === '#staff' ||
    hash === '#/staff'
  );
}
