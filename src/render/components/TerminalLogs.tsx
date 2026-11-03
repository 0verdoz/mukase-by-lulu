import React, { useRef, useEffect } from 'react';
import { Terminal, Trash2, Pause, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { LogEntry } from '../types';

interface TerminalLogsProps {
  logs: LogEntry[];
  onClear: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const TerminalLogs: React.FC<TerminalLogsProps> = ({
  logs,
  onClear,
  isPaused,
  onTogglePause,
  isCollapsed,
  onToggleCollapse,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPaused && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isPaused]);

  return (
    <div className="rounded-xl border border-zinc-800 bg-[#07080c] overflow-hidden shadow-2xl">
      {/* Top terminal bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-400" />
          <span className="text-zinc-200 font-semibold">Render Container Stdout</span>
          <span className="text-zinc-500">·</span>
          <span className="text-zinc-400 text-[11px]">{logs.length} entries</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePause}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-colors ${
              isPaused
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          <button
            onClick={onClear}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <Trash2 className="h-3 w-3" />
            <span>Clear</span>
          </button>

          <button
            onClick={onToggleCollapse}
            className="text-zinc-400 hover:text-zinc-200 p-1 rounded hover:bg-zinc-800 transition-colors"
            title={isCollapsed ? 'Expand Terminal' : 'Collapse Terminal'}
          >
            {isCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      {!isCollapsed && (
        <div
          ref={scrollRef}
          className="p-3 max-h-56 overflow-y-auto font-mono text-[11px] space-y-1 leading-relaxed bg-[#050608]"
        >
          {logs.map((log) => {
            let color = 'text-zinc-300';
            if (log.level === 'success') color = 'text-emerald-400';
            if (log.level === 'warn') color = 'text-amber-400';
            if (log.level === 'error') color = 'text-rose-400';

            return (
              <div key={log.id} className="flex items-start gap-2 select-text hover:bg-zinc-900/30 px-1 py-0.5 rounded">
                <span className="text-zinc-600 shrink-0">{log.timestamp}</span>
                <span className="text-zinc-500 font-semibold shrink-0">[{log.source}]</span>
                <span className={`${color} break-all`}>{log.message}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
