import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, AlertTriangle, KeyRound, ArrowLeft, Clock, Eye, EyeOff } from 'lucide-react';
import { authenticateStaff, getCurrentStaffSession, getLockoutRemainingSeconds, DEFAULT_MASTER_PIN, StaffSession } from '../utils/staffAuth';

interface Props {
  children: (session: StaffSession) => React.ReactNode;
  onExitToStore: () => void;
}

export const StaffAuthGuard: React.FC<Props> = ({ children, onExitToStore }) => {
  const [session, setSession] = useState<StaffSession | null>(() => getCurrentStaffSession());
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [lockoutSecs, setLockoutSecs] = useState<number>(() => getLockoutRemainingSeconds());
  const [showPin, setShowPin] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;

    const res = authenticateStaff(pin);
    if (res.success && res.session) {
      setSession(res.session);
      setErrorMsg('');
      setPin('');
    } else {
      setErrorMsg(res.message);
      const remaining = getLockoutRemainingSeconds();
      if (remaining > 0) setLockoutSecs(remaining);
      setPin('');
    }
  };

  const handleKeypadPress = (val: string) => {
    if (lockoutSecs > 0) return;
    if (val === 'CLEAR') {
      setPin('');
    } else if (val === 'BACK') {
      setPin(prev => prev.slice(0, -1));
    } else if (pin.length < 6) {
      const newPin = pin + val;
      setPin(newPin);
      if (newPin.length === 4) {
        // Auto submit on 4 digits
        const res = authenticateStaff(newPin);
        if (res.success && res.session) {
          setSession(res.session);
          setErrorMsg('');
          setPin('');
        }
      }
    }
  };

  // If already authenticated with valid session
  if (session) {
    return <>{children(session)}</>;
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between p-4 sm:p-6 font-sans select-none">
      
      {/* Top Bar with exit to public store */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between text-xs text-stone-400">
        <button
          onClick={onExitToStore}
          className="flex items-center gap-1.5 hover:text-white transition-colors py-2 px-3 rounded-lg bg-stone-900 border border-stone-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Public Store</span>
        </button>

        <span className="flex items-center gap-1 text-emerald-500 font-mono text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>PORTAL_ENCRYPTION_ACTIVE</span>
        </span>
      </div>

      {/* Center Lockup Box */}
      <div className="max-w-sm w-full mx-auto bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-600/15 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold font-display text-white tracking-tight">
            Mukase Kitchen Terminal
          </h1>
          <p className="text-xs text-stone-400">
            Authorized Personnel Only · Enter Chef Passcode
          </p>
        </div>

        {/* Lockout Alert Banner */}
        {lockoutSecs > 0 ? (
          <div className="p-4 rounded-2xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs text-center space-y-2">
            <AlertTriangle className="w-5 h-5 text-red-400 mx-auto" />
            <p className="font-bold">Security Lockout Active</p>
            <p className="font-mono text-lg font-bold text-red-400">
              {Math.floor(lockoutSecs / 60)}:{(lockoutSecs % 60).toString().padStart(2, '0')}
            </p>
            <p className="text-[11px] text-red-300">
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
                        ? 'bg-amber-500 border-amber-500 shadow-sm shadow-amber-500/50 scale-110'
                        : 'border-stone-700 bg-stone-950'
                    }`}
                  />
                );
              })}
            </div>

            {/* Hidden / Manual Input for desktop keyboard users */}
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={6}
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="Enter 4-digit PIN"
                className="w-full text-center tracking-widest font-mono text-lg px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:outline-none focus:border-amber-500 text-white placeholder:text-stone-600"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 p-1"
                aria-label="Toggle pin view"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 text-center font-medium bg-red-950/40 p-2 rounded-lg border border-red-900/50">
                {errorMsg}
              </p>
            )}

            {/* Virtual Keypad (Great for kitchen tablets & mobile phones) */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLEAR', '0', 'BACK'].map(btn => (
                <button
                  key={btn}
                  type="button"
                  onClick={() => handleKeypadPress(btn)}
                  className={`h-12 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                    btn === 'CLEAR' || btn === 'BACK'
                      ? 'bg-stone-800/60 text-stone-400 hover:bg-stone-800 text-xs'
                      : 'bg-stone-800 hover:bg-stone-700 text-white text-base font-mono shadow-sm'
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
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md shadow-amber-600/20"
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
                className="text-[11px] text-stone-500 hover:text-amber-400 transition-colors"
              >
                (Demo: Quick Fill Master Key <span className="font-mono text-stone-400 font-bold">{DEFAULT_MASTER_PIN}</span>)
              </button>
            </div>

          </form>
        )}

      </div>

      {/* Security Notice */}
      <div className="max-w-md w-full mx-auto text-center text-[11px] text-stone-600 space-y-1">
        <p>Mukase by Lulu Secure Staff Terminal v2.4</p>
        <p>Access attempts are cryptographically timestamped and logged.</p>
      </div>

    </div>
  );
};
