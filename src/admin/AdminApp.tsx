import React, { useState, useEffect } from 'react';
import { OrderProvider } from '../context/OrderContext';
import { StaffAuthGuard } from '../components/StaffAuthGuard';
import { StandaloneStaffPortal } from '../components/StandaloneStaffPortal';
import { checkServerHealth } from '../services/orderApi';
import { Radio, ExternalLink } from 'lucide-react';

export const AdminApp: React.FC = () => {
  const [isServerLive, setIsServerLive] = useState<boolean | null>(null);

  useEffect(() => {
    checkServerHealth().then(live => setIsServerLive(live));
    const interval = setInterval(() => {
      checkServerHealth().then(live => setIsServerLive(live));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const storeUrl = (import.meta as any).env?.VITE_STORE_URL || (isLocal ? 'http://localhost:3000' : 'https://mukase-by-lulu.vercel.app');

  const handleExitToStore = () => {
    // Navigate to customer storefront on port 3000 / production Vercel
    window.location.href = storeUrl;
  };

  return (
    <OrderProvider>
      <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans selection:bg-orange-500/20 selection:text-orange-900">
        {/* Sync Engine Status Bar */}
        <div className="bg-white/90 backdrop-blur-md border-b border-stone-200/90 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 text-xs text-stone-600 select-none shadow-2xs">
          <div className="flex items-center gap-2 min-w-0 shrink-0">
            <Radio className={`w-3.5 h-3.5 shrink-0 ${isServerLive ? 'text-emerald-500 animate-pulse' : 'text-amber-500'}`} />
            <span className="font-semibold text-xs text-stone-800 whitespace-nowrap">
              {isServerLive ? 'Sync Engine: LIVE' : 'Sync Engine'}
            </span>
          </div>

          <a
            href={storeUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-orange-600 hover:text-orange-700 font-semibold transition-colors text-xs whitespace-nowrap shrink-0 ml-auto"
          >
            <span className="whitespace-nowrap">Customer Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          </a>
        </div>

        <StaffAuthGuard onExitToStore={handleExitToStore}>
          {(session, logout) => (
            <StandaloneStaffPortal session={session} onExit={logout} />
          )}
        </StaffAuthGuard>
      </div>
    </OrderProvider>
  );
};
