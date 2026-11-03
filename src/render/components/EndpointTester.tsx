import React, { useState } from 'react';
import { Play, RefreshCw, Send, CheckCircle2, Clock, ShieldCheck, HardDrive } from 'lucide-react';
import { EndpointTestResult } from '../types';

interface EndpointTesterProps {
  onLogGenerated: (message: string, source: 'RENDER-PROBE' | 'RENDER-HTTP') => void;
}

export const EndpointTester: React.FC<EndpointTesterProps> = ({ onLogGenerated }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/healthz');
  const [method, setMethod] = useState<'GET' | 'POST'>('GET');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<EndpointTestResult | null>({
    endpoint: '/healthz',
    method: 'GET',
    status: 200,
    statusText: 'OK',
    durationMs: 1.8,
    timestamp: new Date().toISOString(),
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'x-render-service': 'render-modern-service',
      'x-render-engine': 'Modern-Class-v2',
      'x-powered-by': 'Render-Modern-Class',
      'cache-control': 'no-cache',
    },
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'render-modern-service',
      region: 'oregon',
      uptimeSeconds: 1420,
      port: 3000,
      orchestrator: 'render-cloud-nomad',
    },
  });

  const availableEndpoints = [
    {
      path: '/healthz',
      method: 'GET' as const,
      description: 'Render Cloud Health Probe (Uptime monitoring & rollout verification)',
      presetResponse: (uptime: number) => ({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'render-modern-service',
        region: 'oregon',
        uptimeSeconds: uptime,
      }),
    },
    {
      path: '/api/metrics',
      method: 'GET' as const,
      description: 'System memory, request counters, and process heap statistics',
      presetResponse: (uptime: number) => ({
        metrics: {
          startTime: Date.now() - uptime * 1000,
          uptimeSeconds: uptime,
          totalRequests: Math.floor(uptime * 1.4),
          memoryUsageMb: 42.6,
          heapTotalMb: 78.2,
          activeConnections: 1,
        },
        config: {
          port: 3000,
          host: '0.0.0.0',
          environment: 'production',
          nodeVersion: 'v22.14.0',
        },
      }),
    },
    {
      path: '/api/render-blueprint',
      method: 'GET' as const,
      description: 'Declarative render.yaml blueprint definition served directly from the class',
      presetResponse: () => ({
        service: 'modern-render-service',
        runtime: 'node-lts',
        plan: 'starter',
        autoDeploy: true,
        healthCheckPath: '/healthz',
        env: {
          NODE_ENV: 'production',
          PORT: '3000',
        },
      }),
    },
    {
      path: '/api/v1/render-view',
      method: 'POST' as const,
      description: 'Class-based dynamic SSR page renderer test',
      presetResponse: () => ({
        rendered: true,
        template: 'ModernClassView',
        viewEngine: 'TypeScript-Class-SSR',
        sizeBytes: 2412,
        renderTimeMs: 0.94,
      }),
    },
  ];

  const handleExecute = async () => {
    setLoading(true);
    const start = performance.now();

    // Simulate real cloud network dispatch
    await new Promise((r) => setTimeout(r, 60 + Math.random() * 80));
    const duration = performance.now() - start;

    const matched = availableEndpoints.find((e) => e.path === selectedEndpoint) || availableEndpoints[0];
    const uptimeSec = Math.floor(Math.random() * 3600) + 600;

    const responseData = matched.presetResponse(uptimeSec);

    const testRes: EndpointTestResult = {
      endpoint: selectedEndpoint,
      method,
      status: 200,
      statusText: 'OK',
      durationMs: Math.round(duration * 10) / 10,
      timestamp: new Date().toISOString(),
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'x-render-service': 'render-modern-service',
        'x-render-engine': 'Modern-Class-v2',
        'x-render-region': 'frankfurt-1',
        'server-timing': `render-app;dur=${duration.toFixed(1)}`,
      },
      data: responseData,
    };

    setResult(testRes);
    setLoading(false);
    onLogGenerated(
      `${method} ${selectedEndpoint} -> 200 OK (${duration.toFixed(1)}ms)`,
      selectedEndpoint === '/healthz' ? 'RENDER-PROBE' : 'RENDER-HTTP'
    );
  };

  return (
    <div className="space-y-6">
      {/* Configuration bar */}
      <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Live Endpoint Diagnostics</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Execute live synthetic queries against the <code className="font-mono text-zinc-300">RenderAppServer</code> routes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as 'GET' | 'POST')}
              className="bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-500"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
            </select>

            <select
              value={selectedEndpoint}
              onChange={(e) => {
                setSelectedEndpoint(e.target.value);
                const item = availableEndpoints.find((i) => i.path === e.target.value);
                if (item) setMethod(item.method);
              }}
              className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-500 min-w-[200px]"
            >
              {availableEndpoints.map((ep) => (
                <option key={ep.path} value={ep.path}>
                  {ep.method} {ep.path}
                </option>
              ))}
            </select>

            <button
              onClick={handleExecute}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              <span>Send Request</span>
            </button>
          </div>
        </div>

        {/* Selected endpoint description */}
        <div className="mt-3 pt-3 border-t border-zinc-800/80 text-xs text-zinc-400 flex items-center justify-between font-mono">
          <span>{availableEndpoints.find((e) => e.path === selectedEndpoint)?.description}</span>
          <span className="text-emerald-400">Host: 0.0.0.0:3000</span>
        </div>
      </div>

      {/* Response Display Box */}
      {result && (
        <div className="rounded-xl border border-zinc-800 bg-[#07080c] overflow-hidden">
          {/* Response Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-purple-400 font-bold">{result.method}</span>
              <span className="text-zinc-300">{result.endpoint}</span>
              <span className="text-zinc-600">·</span>
              <span className="text-emerald-400 font-semibold bg-emerald-950/80 border border-emerald-800/40 px-2 py-0.5 rounded text-[11px]">
                {result.status} {result.statusText}
              </span>
            </div>

            <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-zinc-500" />
                {result.durationMs}ms
              </span>
              <span className="text-zinc-600">·</span>
              <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Response Content Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800 text-xs font-mono">
            {/* Headers Column */}
            <div className="p-4 bg-zinc-950/60">
              <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold mb-2">
                Response Headers
              </div>
              <div className="space-y-1.5 text-zinc-400 text-[11px]">
                {Object.entries(result.headers).map(([key, val]) => (
                  <div key={key} className="break-all">
                    <span className="text-zinc-500">{key}:</span>{' '}
                    <span className="text-zinc-300">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* JSON Payload Column */}
            <div className="lg:col-span-2 p-4 overflow-x-auto max-h-[380px]">
              <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold mb-2">
                JSON Response Body
              </div>
              <pre className="text-sky-300 text-xs leading-relaxed">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
