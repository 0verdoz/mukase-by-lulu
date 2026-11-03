export type TabType = 'visualizer' | 'code' | 'endpoints' | 'blueprint' | 'architecture';

export type CodeVariant = 'standard' | 'minimal' | 'fullstack' | 'worker';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'error';
  source: 'RENDER-BOOT' | 'RENDER-PROBE' | 'RENDER-CLASS' | 'RENDER-HTTP';
  message: string;
}

export interface SystemStats {
  uptimeSeconds: number;
  totalRequests: number;
  memoryMb: number;
  avgLatencyMs: number;
  status: 'healthy' | 'draining' | 'restarting';
  port: number;
  host: string;
  nodeVersion: string;
}

export interface EndpointTestResult {
  endpoint: string;
  method: 'GET' | 'POST';
  status: number;
  statusText: string;
  durationMs: number;
  timestamp: string;
  headers: Record<string, string>;
  data: unknown;
}
