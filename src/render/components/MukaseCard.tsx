import React from 'react';
import { Activity, Code, PlusCircle, ArrowUpRight, Wifi, ShieldCheck } from 'lucide-react';
import { SteamPotIcon } from './SteamPotIcon';

interface MukaseCardProps {
  onOpenHealth: () => void;
  onOpenApi: () => void;
  onSimulateOrder: () => void;
  activeOrderCount: number;
  latencyMs: number;
}

export const MukaseCard: React.FC<MukaseCardProps> = ({
  onOpenHealth,
  onOpenApi,
  onSimulateOrder,
  activeOrderCount,
  latencyMs,
}) => {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      {/* Warm artisan paper card */}
      <div className="relative rounded-2xl bg-white border border-stone-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 transition-all hover:border-stone-300">
        
        {/* Top Operational Status Header (Zero-Pill discipline: clean unboxed text) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-stone-100">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            <span className="font-semibold tracking-wider text-emerald-800 uppercase text-[11px]">
              Live & Healthy
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-stone-500">Bi-Directional Bridge Active</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500">
            <Wifi className="h-3.5 w-3.5 text-stone-400" />
            <span>WSS {latencyMs.toFixed(1)}ms</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-stone-700 font-medium">{activeOrderCount} Tickets on Pass</span>
          </div>
        </div>

        {/* Brand Icon & Heading */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <SteamPotIcon size={52} className="cursor-pointer" />
          </div>

          <div>
            <div className="text-[11px] font-mono tracking-widest text-amber-800/80 uppercase font-semibold mb-1">
              The Kitchen Heartbeat · Akwaaba
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900">
              <span className="text-orange-600 font-serif-display font-normal text-3xl sm:text-4xl lg:text-5xl mr-1.5 italic">
                Mukase
              </span>
              Sync Engine
            </h1>
          </div>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto font-normal">
            Real-time bi-directional synchronization bridge connecting the Customer Storefront and Kitchen Admin Terminal.
          </p>
        </div>

        {/* Primary Action Buttons (Elevated from the original screenshot with human craft) */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenHealth}
            className="w-full sm:w-auto min-w-[170px] inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white px-5 py-3 text-sm font-medium transition-all shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <Activity className="h-4 w-4 text-emerald-400" />
            <span>Health Status</span>
          </button>

          <button
            onClick={onOpenApi}
            className="w-full sm:w-auto min-w-[170px] inline-flex items-center justify-center gap-2 rounded-xl bg-stone-100 hover:bg-stone-200/90 text-stone-900 border border-stone-200/80 px-5 py-3 text-sm font-medium transition-all active:scale-[0.98] cursor-pointer"
          >
            <Code className="h-4 w-4 text-orange-600" />
            <span>Active Orders API</span>
          </button>

          <button
            onClick={onSimulateOrder}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-orange-300 hover:border-orange-500 bg-orange-50/70 hover:bg-orange-100/70 text-orange-800 px-4 py-3 text-sm font-medium transition-all active:scale-[0.98] cursor-pointer"
            title="Simulate a new customer order entering the kitchen"
          >
            <PlusCircle className="h-4 w-4 text-orange-600" />
            <span>+ Send Order</span>
          </button>
        </div>

        {/* Quiet footer metadata */}
        <div className="mt-8 pt-5 border-t border-stone-100 flex flex-wrap items-center justify-between text-[11px] font-mono text-stone-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-stone-400" />
            <span>Zero-Downtime Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Storefront Ingress ⇄ Kitchen KDS</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-stone-600">v2.4.1</span>
          </div>
        </div>

      </div>
    </div>
  );
};
