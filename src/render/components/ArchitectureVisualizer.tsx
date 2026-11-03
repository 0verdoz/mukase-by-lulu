import React, { useState } from 'react';
import { Globe, Server, Code2, Zap, ArrowRight, Play, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SystemStats } from '../types';

interface ArchitectureVisualizerProps {
  stats: SystemStats;
  onSendRequest: () => void;
  onSendBurst: () => void;
  onSimulateSigterm: () => void;
  isSimulating: boolean;
  activeStep: number;
}

export const ArchitectureVisualizer: React.FC<ArchitectureVisualizerProps> = ({
  stats,
  onSendRequest,
  onSendBurst,
  onSimulateSigterm,
  isSimulating,
  activeStep,
}) => {
  const [selectedNode, setSelectedNode] = useState<'edge' | 'mesh' | 'server' | 'response'>('server');

  const nodes = [
    {
      id: 'edge' as const,
      name: 'Render Edge CDN',
      stepNum: 1,
      subtext: 'Anycast DNS & TLS 1.3',
      icon: Globe,
      ip: 'render.app (Public IP)',
      port: '443 (HTTPS)',
      status: 'Active',
      details: 'Terminates client HTTPS connections at Render edge POPs around the world (Oregon, Frankfurt, Singapore, Ohio). Proxies encrypted traffic into private cloud network.',
    },
    {
      id: 'mesh' as const,
      name: 'Container Ingress',
      stepNum: 2,
      subtext: 'Dynamic $PORT Routing',
      icon: Server,
      ip: '0.0.0.0',
      port: `${stats.port}`,
      status: 'Routed',
      details: 'Render container orchestrator maps dynamic ephemeral port to container. Binding to 0.0.0.0 is crucial—binding to 127.0.0.1 causes health check failures on Render.',
    },
    {
      id: 'server' as const,
      name: 'RenderAppServer Class',
      stepNum: 3,
      subtext: 'TypeScript Class Instance',
      icon: Code2,
      ip: 'Process Heap',
      port: `v${stats.nodeVersion}`,
      status: stats.status === 'healthy' ? 'Healthy' : stats.status,
      details: 'The modern class constructor sets up Express middlewares, /healthz probes, SIGTERM graceful connection drainage, and API routes inside an isolated OOP unit.',
    },
    {
      id: 'response' as const,
      name: 'Client Response',
      stepNum: 4,
      subtext: '200 OK + Telemetry',
      icon: Zap,
      ip: 'Stream Completed',
      port: `${stats.avgLatencyMs.toFixed(1)}ms`,
      status: 'Delivered',
      details: 'Delivers response headers X-Render-Service, CORS headers, and HTML/JSON payloads with zero packet drops.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span>Render Cloud Ingress Pipeline</span>
            <span className="text-[11px] font-mono font-normal text-emerald-400 bg-emerald-950/80 border border-emerald-800/40 px-2 py-0.5 rounded">
              0.0.0.0:{stats.port} ACTIVE
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Test the packet traversal from edge gateway down into the <code className="font-mono text-zinc-300">RenderAppServer</code> class.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSendRequest}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors shadow-sm disabled:opacity-50"
          >
            {isSimulating ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
            <span>Send Request</span>
          </button>

          <button
            onClick={onSendBurst}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-medium transition-colors disabled:opacity-50"
          >
            <Zap className="h-3.5 w-3.5 text-yellow-400" />
            <span>Burst (5x)</span>
          </button>

          <button
            onClick={onSimulateSigterm}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-zinc-700 text-xs font-medium transition-colors"
            title="Simulate Render zero-downtime rolling update SIGTERM signal"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Simulate SIGTERM</span>
          </button>
        </div>
      </div>

      {/* Visual Pipeline Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          const isCurrentActive = activeStep === node.stepNum;
          const isSelected = selectedNode === node.id;

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node.id)}
              className={`cursor-pointer rounded-xl p-5 border transition-all relative ${
                isSelected
                  ? 'bg-zinc-900 border-zinc-600 shadow-lg shadow-black/50'
                  : 'bg-zinc-950/80 border-zinc-800/90 hover:border-zinc-700 hover:bg-zinc-900/50'
              } ${isCurrentActive ? 'ring-2 ring-emerald-500/80 ring-offset-2 ring-offset-[#090a0f]' : ''}`}
            >
              {/* Top bar */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                  Step 0{node.stepNum}
                </span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    node.status === 'Healthy' || node.status === 'Active'
                      ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/40'
                      : 'text-zinc-400 bg-zinc-900 border border-zinc-800'
                  }`}
                >
                  {node.status}
                </span>
              </div>

              {/* Node Icon & Name */}
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`p-2 rounded-lg border ${
                    isCurrentActive
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white tracking-tight">{node.name}</h4>
                  <p className="text-[11px] text-zinc-400">{node.subtext}</p>
                </div>
              </div>

              {/* Network specs */}
              <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>{node.ip}</span>
                <span className="text-zinc-500">{node.port}</span>
              </div>

              {/* Packet tracer indicator */}
              {isCurrentActive && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full animate-ping" />
              )}
            </div>
          );
        })}
      </div>

      {/* Node Inspector Details Box */}
      {selectedNode && (
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-mono uppercase text-zinc-500 mb-1">
                Node Specification Details
              </div>
              <h4 className="text-sm font-semibold text-white">
                {nodes.find((n) => n.id === selectedNode)?.name}
              </h4>
            </div>
            <div className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Render Verified Spec
            </div>
          </div>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            {nodes.find((n) => n.id === selectedNode)?.details}
          </p>

          <div className="mt-4 pt-3 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-zinc-500 block text-[10px]">INSPECTION</span>
              <span className="text-zinc-300">{nodes.find((n) => n.id === selectedNode)?.subtext}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">ADDRESS / TARGET</span>
              <span className="text-zinc-300">{nodes.find((n) => n.id === selectedNode)?.ip}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">PORT CONFIG</span>
              <span className="text-zinc-300">{nodes.find((n) => n.id === selectedNode)?.port}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">DIAGNOSTIC STATUS</span>
              <span className="text-emerald-400">{nodes.find((n) => n.id === selectedNode)?.status}</span>
            </div>
          </div>
        </div>
      )}

      {/* Response Header Sample Card */}
      <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 font-mono text-xs text-zinc-300">
        <div className="flex items-center justify-between text-zinc-500 text-[11px] mb-2 border-b border-zinc-800 pb-2">
          <span>SAMPLE RESPONSE HEADERS (RenderAppServer output)</span>
          <span className="text-emerald-400">HTTP/1.1 200 OK</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <div><span className="text-zinc-500">X-Render-Service:</span> render-modern-service</div>
          <div><span className="text-zinc-500">X-Powered-By:</span> Render-Modern-Class</div>
          <div><span className="text-zinc-500">Content-Type:</span> application/json; charset=utf-8</div>
          <div><span className="text-zinc-500">Server-Timing:</span> render-app;dur={stats.avgLatencyMs.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
};
