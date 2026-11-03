import React, { useState } from 'react';
import { X, Activity, RefreshCw, CheckCircle2, Wifi, Server, ShieldCheck, Tablet } from 'lucide-react';
import { MUKASE_DIAGNOSTICS } from '../mukaseData';

interface HealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  latencyMs: number;
  onPing: () => void;
}

export const HealthModal: React.FC<HealthModalProps> = ({
  isOpen,
  onClose,
  latencyMs,
  onPing,
}) => {
  const [pinging, setPinging] = useState(false);

  if (!isOpen) return null;

  const handlePingClick = async () => {
    setPinging(true);
    await new Promise((r) => setTimeout(r, 120));
    onPing();
    setPinging(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg rounded-2xl bg-white border border-stone-200 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Mukase Engine Health Diagnostics
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                Real-Time Kitchen Sync Bridge Telemetry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Live Status Vitals */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
            <span className="text-[11px] font-mono text-stone-500 uppercase block mb-1">
              Engine Uptime
            </span>
            <span className="text-base font-bold font-mono text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              99.99% Operational
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
            <span className="text-[11px] font-mono text-stone-500 uppercase block mb-1">
              Round-Trip Latency
            </span>
            <span className="text-base font-bold font-mono text-stone-900">
              {latencyMs.toFixed(1)}ms
            </span>
          </div>
        </div>

        {/* Connected Terminals */}
        <div className="space-y-3 mb-5">
          <div className="text-xs font-mono font-semibold text-stone-700 uppercase tracking-wider">
            Connected Kitchen Terminals ({MUKASE_DIAGNOSTICS.connectedTerminals.length})
          </div>

          <div className="divide-y divide-stone-100 rounded-xl border border-stone-200/80 bg-white overflow-hidden text-xs">
            {MUKASE_DIAGNOSTICS.connectedTerminals.map((term, idx) => (
              <div key={idx} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <Tablet className="h-4 w-4 text-stone-400" />
                  <div>
                    <span className="font-semibold text-stone-800">{term.name}</span>
                    <span className="block text-[11px] font-mono text-stone-400">{term.ip}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-emerald-700 font-medium">Synced</span>
                  <span className="text-stone-400">· {term.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Infrastructure Specs */}
        <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 space-y-1 mb-5">
          <div className="font-semibold flex items-center gap-1.5 text-amber-950">
            <ShieldCheck className="h-4 w-4 text-amber-700" />
            <span>Bi-Directional Guarantee</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-900/80">
            Every customer order ticket, modification, or cancellation is authoritatively synchronized across kitchen displays and web storefronts in &lt;2ms.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <button
            onClick={handlePingClick}
            disabled={pinging}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${pinging ? 'animate-spin' : ''}`} />
            <span>Ping Bridge Now</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 text-xs font-medium transition-colors cursor-pointer"
          >
            Close Diagnostics
          </button>
        </div>

      </div>
    </div>
  );
};
