import React from 'react';
import { ArrowRight, Code2, Server, ShieldCheck, Zap, Activity } from 'lucide-react';
import { SystemStats } from '../types';

interface HeroProps {
  stats: SystemStats;
  onExploreCode: () => void;
  onSimulateTraffic: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  stats,
  onExploreCode,
  onSimulateTraffic,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-zinc-800/80 bg-gradient-to-b from-[#0e1017] via-[#090a0f] to-[#090a0f] py-12 md:py-16">
      {/* Subtle grid background effect */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          {/* Quiet sub-heading kicker */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-3 tracking-wide">
            <span className="text-emerald-400">CLASS RUNTIME</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>RENDER WEB SERVICE SPECIFICATION</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>PORT BIND: 0.0.0.0</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 leading-[1.15]">
            Modern Class Architecture for Render.
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed mb-8 max-w-2xl">
            A production-ready TypeScript <code className="text-emerald-400 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono">RenderAppServer</code> class
            engineered specifically for Render cloud hosting. Encapsulates container lifecycles, graceful <code className="text-sky-400 font-mono text-sm">SIGTERM</code> teardown,
            zero-downtime health probes, and dynamic port orchestration.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <button
              onClick={onExploreCode}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-100 transition-colors shadow-sm"
            >
              <Code2 className="h-4 w-4" />
              <span>Explore index.ts Class</span>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-600" />
            </button>

            <button
              onClick={onSimulateTraffic}
              className="flex items-center gap-2 rounded-lg bg-zinc-900 border border-zinc-700/80 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <Zap className="h-4 w-4 text-emerald-400" />
              <span>Simulate Cloud Ingress</span>
            </button>
          </div>

          {/* Unboxed Metadata Metrics Bar */}
          <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">
                Container Host
              </div>
              <div className="text-lg font-bold font-mono text-zinc-200">
                {stats.host}:{stats.port}
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Required for Render mesh</div>
            </div>

            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">
                Health Probe Latency
              </div>
              <div className="text-lg font-bold font-mono text-emerald-400 flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
                {stats.avgLatencyMs.toFixed(1)}ms
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Sub-5ms response target</div>
            </div>

            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">
                Memory Footprint
              </div>
              <div className="text-lg font-bold font-mono text-sky-400">
                {stats.memoryMb.toFixed(1)} MB
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">RSS / Heap footprint</div>
            </div>

            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">
                Total Ingress Probes
              </div>
              <div className="text-lg font-bold font-mono text-purple-400">
                {stats.totalRequests.toLocaleString()}
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Live synthetic traffic</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
