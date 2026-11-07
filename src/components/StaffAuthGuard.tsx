import React, { useState, useEffect, useRef } from 'react';
import { Lock, ShieldCheck, AlertTriangle, KeyRound, ArrowLeft, Clock, Eye, EyeOff } from 'lucide-react';
import { authenticateStaff, getCurrentStaffSession, getLockoutRemainingSeconds, DEFAULT_MASTER_PIN, StaffSession, clearStaffSession } from '../utils/staffAuth';
import { SteamPotIcon } from './SteamPotIcon';

interface Props {
  children: (session: StaffSession, logout: () => void) => React.ReactNode;
  onExitToStore: () => void;
}

export const StaffAuthGuard: React.FC<Props> = ({ children, onExitToStore }) => {
  const [session, setSession] = useState<StaffSession | null>(() => getCurrentStaffSession());
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [lockoutSecs, setLockoutSecs] = useState<number>(() => getLockoutRemainingSeconds());
  const [showPin, setShowPin] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  
  // Auto-focus input on load and when session clears
  useEffect(() => {
    if (!session) {
      inputRef.current?.focus();
    }
  }, [session]);

  // Global listener for immediate logout synchronization across components
  useEffect(() => {
    const handleLogoutEvent = () => {
      clearStaffSession();
      setSession(null);
      setPin('');
    };
    window.addEventListener('mukase_staff_logout', handleLogoutEvent);
    return () => window.removeEventListener('mukase_staff_logout', handleLogoutEvent);
  }, []);

  // Timer for lockout countdown
  useEffect(() => {
    if (lockoutSecs <= 0) return;
    const interval = setInterval(() => {
      setLockoutSecs(prev => {
        if (prev <= 1) {
          setErrorMsg('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSecs]);

  const handleLogout = () => {
    clearStaffSession();
    setSession(null);
    setPin('');
    window.dispatchEvent(new Event('mukase_staff_logout'));
  };

  const verifyPin = (candidatePin: string) => {
    const res = authenticateStaff(candidatePin);
    if (res.success && res.session) {
      setSession(res.session);
      setErrorMsg('');
      setPin('');
    } else {
      setErrorMsg(res.message);
      const remaining = getLockoutRemainingSeconds();
      if (remaining > 0) setLockoutSecs(remaining);
      setPin('');
      inputRef.current?.focus();
    }
  };

  // Global physical keyboard listener (captures 0-9, Backspace, Enter, Esc from anywhere)
  useEffect(() => {
    if (session || lockoutSecs > 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept browser shortcuts (Ctrl+R, Ctrl+Shift+I, etc.)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        setPin(prev => {
          if (prev.length >= 6) return prev;
          const next = prev + e.key;
          if (next.length === 4) {
            setTimeout(() => verifyPin(next), 40);
          }
          return next;
        });
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        setPin(prev => prev.slice(0, -1));
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setPin('');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        setPin(currentPin => {
          if (currentPin.trim()) {
            verifyPin(currentPin);
          }
          return currentPin;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [session, lockoutSecs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;
    verifyPin(pin);
  };

  const handleKeypadPress = (val: string) => {
    if (lockoutSecs > 0) return;
    inputRef.current?.focus();
    if (val === 'CLEAR') {
      setPin('');
    } else if (val === 'BACK') {
      setPin(prev => prev.slice(0, -1));
    } else if (pin.length < 6) {
      const newPin = pin + val;
      setPin(newPin);
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  // If already authenticated with valid session
  if (session) {
    return <>{children(session, handleLogout)}</>;
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col justify-between p-4 sm:p-6 font-sans select-none selection:bg-orange-500/20 selection:text-orange-900">
      
      {/* Top Bar with exit to public store */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between text-xs text-stone-600">
        <button
          onClick={onExitToStore}
          className="flex items-center gap-1.5 font-medium hover:text-stone-900 transition-colors py-2 px-3 rounded-xl bg-white border border-stone-200/90 shadow-2xs hover:border-stone-300"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-stone-500" />
          <span>Exit to Public Store</span>
        </button>

        <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>PORTAL SECURED</span>
        </span>
      </div>

      {/* Center Lockup Box */}
      <div className="max-w-sm w-full mx-auto bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgb(0,0,0,0.04)] space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center pb-1">
            <SteamPotIcon size={48} />
          </div>

          <h1 className="text-xl font-bold font-display text-stone-900 tracking-tight">
            Mukase Kitchen Terminal
          </h1>
          <p className="text-xs text-stone-500">
            Authorized Personnel Only · Enter Chef Passcode
          </p>
        </div>

        {/* Lockout Alert Banner */}
        {lockoutSecs > 0 ? (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs text-center space-y-2">
            <AlertTriangle className="w-5 h-5 text-red-600 mx-auto" />
            <p className="font-bold">Security Lockout Active</p>
            <p className="font-mono text-lg font-bold text-red-600">
              {Math.floor(lockoutSecs / 60)}:{(lockoutSecs % 60).toString().padStart(2, '0')}
            </p>
            <p className="text-[11px] text-red-700">
              Multiple failed entries detected. Terminal locked against unauthorized brute-force.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* PIN Display Dots */}
            <div className="flex items-center justify-center gap-3 py-2">
              {[0, 1, 2, 3].map(idx => {
                const filled = pin.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      filled
                        ? 'bg-orange-500 border-orange-500 shadow-sm shadow-orange-500/40 scale-110'
                        : 'border-stone-300 bg-stone-100'
                    }`}
                  />
                );
              })}
            </div>

            {/* Hidden / Manual Input for desktop keyboard users */}
            <div className="relative">
              <input
                ref={inputRef}
                autoFocus
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={pin}
                onChange={e => {
                  const cleaned = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setPin(cleaned);
                  if (cleaned.length === 4) {
                    verifyPin(cleaned);
                  }
                }}
                placeholder="Enter 4-digit PIN"
                className="w-full text-center tracking-widest font-mono text-lg px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-stone-900 placeholder:text-stone-400"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 transition-colors"
                aria-label="Toggle pin view"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-700 text-center font-medium bg-red-50 p-2.5 rounded-xl border border-red-200">
                {errorMsg}
              </p>
            )}

            {/* Virtual Keypad (Optimized for touchscreens & mobile phones) */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLEAR', '0', 'BACK'].map(btn => (
                <button
                  key={btn}
                  type="button"
                  onClick={() => handleKeypadPress(btn)}
                  className={`h-12 rounded-2xl text-sm font-semibold transition-all active:scale-95 ${
                    btn === 'CLEAR' || btn === 'BACK'
                      ? 'bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs border border-stone-200/80 font-medium'
                      : 'bg-white hover:bg-stone-50 text-stone-900 text-lg font-bold font-mono border border-stone-200/90 shadow-2xs'
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>

            {/* Unlock Button */}
            <button
              type="submit"
              disabled={!pin}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md shadow-orange-600/20 active:scale-95 cursor-pointer"
            >
              Verify Passcode
            </button>

            {/* Quick Demo Assist */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setPin(DEFAULT_MASTER_PIN);
                  const res = authenticateStaff(DEFAULT_MASTER_PIN);
                  if (res.success && res.session) setSession(res.session);
                }}
                className="text-[11px] text-stone-500 hover:text-orange-600 transition-colors"
              >
                (Demo: Quick Fill Master Key <span className="font-mono text-stone-700 font-bold">{DEFAULT_MASTER_PIN}</span>)
              </button>
            </div>

          </form>
        )}

      </div>

      {/* Security Notice */}
      <div className="max-w-md w-full mx-auto text-center text-[11px] text-stone-400 space-y-1">
        <p className="font-medium text-stone-500">Mukase by Lulu Secure Staff Terminal v2.4</p>
        <p>Access attempts are cryptographically timestamped and logged.</p>
      </div>

    </div>
  );
};
