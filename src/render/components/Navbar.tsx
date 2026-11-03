import { SteamPotIcon } from './SteamPotIcon';
import React from 'react';
import { Box, Play, FileCode2, ExternalLink, RefreshCw } from 'lucide-react';
import { TabType } from '../types';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onQuickPing: () => void;
  pinging: boolean;
  totalRequests: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onQuickPing,
  pinging,
  totalRequests,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#090a0f]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <SteamPotIcon size={34} />
            <div className="hidden">
              <Box className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <span className="font-semibold text-base tracking-tight text-white flex items-center gap-1.5">
                RENDER
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.2 rounded">
                  index.ts
                </span>
              </span>
            </div>
          </div>

          {/* Unboxed Metadata (Rule: No static pills, clean unboxed text with dots) */}
          <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <span>0.0.0.0:$PORT</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>TypeScript 5</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Healthy
            </span>
          </div>
        </div>

        {/* Navigation tabs as functional interactive controls */}
        <nav className="flex items-center gap-1 p-1 bg-zinc-900/90 rounded-lg border border-zinc-800">
          <button
            onClick={() => setActiveTab('visualizer')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'visualizer'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Live Architecture
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'code'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            index.ts Class
          </button>
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'endpoints'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            API Tester
          </button>
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'blueprint'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            render.yaml
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onQuickPing}
            disabled={pinging}
            className="flex items-center gap-2 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 text-xs font-medium transition-colors"
            title="Send synthetic HTTP probe to the RenderAppServer instance"
          >
            {pinging ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-current" />
            )}
            <span>Probe Server ({totalRequests})</span>
          </button>
        </div>

      </div>
    </header>
  );
};
