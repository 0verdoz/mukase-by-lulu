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

  const handleExitToStore = () => {
    // Navigate to customer storefront on port 3000
    window.location.href = 'http://localhost:3000';
  };

  return (
    <OrderProvider>
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
        {/* Sync Engine Status Bar */}
        <div className="bg-stone-900 border-b border-stone-800 px-4 py-1.5 flex items-center justify-between text-[11px] text-stone-400 select-none">
          <div className="flex items-center gap-2">
            <Radio className={`w-3 h-3 ${isServerLive ? 'text-emerald-400 animate-pulse' : 'text-amber-500'}`} />
            <span>
              {isServerLive === null
                ? 'Connecting to sync engine...'
                : isServerLive
                ? 'Sync Engine: LIVE (Port 5000 bi-directional push active)'
                : 'Sync Engine: Standalone Mode (Local storage cache active)'}
            </span>
          </div>

          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors font-medium"
          >
            <span>Customer Store (Port 3000)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <StaffAuthGuard onExitToStore={handleExitToStore}>
          {(session) => (
            <StandaloneStaffPortal session={session} onExit={() => {}} />
          )}
        </StaffAuthGuard>
      </div>
    </OrderProvider>
  );
};
