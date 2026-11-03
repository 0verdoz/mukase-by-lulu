export const CODE_TEMPLATES = {
  standard: `/**
 * RENDER PLATFORM — PRODUCTION MODERN CLASS ENTRYPOINT
 * Deployable on Render.com Web Services
 * File: index.ts
 */
import express, { Request, Response, NextFunction } from 'express';
import http from 'http';

export interface RenderConfig {
  port: number;
  host: string;
  serviceName: string;
}

export class RenderAppServer {
  private readonly app: express.Application;
  private server: http.Server | null = null;
  private readonly config: RenderConfig;
  private requestCount: number = 0;
  private readonly startTime: number = Date.now();
  private isDraining: boolean = false;

  constructor(customConfig?: Partial<RenderConfig>) {
    this.config = {
      // Render injects PORT dynamically; 0.0.0.0 is required for container ingress
      port: Number(process.env.PORT) || 3000,
      host: '0.0.0.0',
      serviceName: process.env.RENDER_SERVICE_NAME || 'render-modern-service',
      ...customConfig,
    };

    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
  }

  private setupMiddlewares(): void {
    this.app.use(express.json());

    // Request instrumentation & diagnostic headers
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      this.requestCount++;
      res.setHeader('X-Render-Service', this.config.serviceName);
      res.setHeader('X-Render-Engine', 'Modern-Class-v2');
      next();
    });
  }

  private setupRoutes(): void {
    // Health probe for Render uptime monitors & rolling deploys
    this.app.get('/healthz', (_req: Request, res: Response) => {
      if (this.isDraining) {
        res.status(503).json({ status: 'draining' });
        return;
      }
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      });
    });

    // Telemetry & metrics route
    this.app.get('/api/metrics', (_req: Request, res: Response) => {
      const memory = process.memoryUsage();
      res.json({
        uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
        totalRequests: this.requestCount,
        memoryUsageMb: Math.round(memory.heapUsed / 1024 / 1024 * 100) / 100,
      });
    });

    // Modern index page response
    this.app.get('/', (_req: Request, res: Response) => {
      res.send(\`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <title>Render App Service</title>
            <style>
              body { background: #090a0f; color: #f1f5f9; font-family: system-ui; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
              .card { background: #11131c; border: 1px solid #1e2233; padding: 2.5rem; border-radius: 12px; max-width: 480px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
              .dot { display: inline-block; width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-right: 8px; }
            </style>
          </head>
          <body>
            <div class="card">
              <h2><span class="dot"></span>Render Modern Class</h2>
              <p style="color: #94a3b8; margin: 0.75rem 0 1.5rem;">Container successfully initialized & running on Render cloud.</p>
              <div style="font-family: monospace; font-size: 0.9rem; color: #38bdf8;">Listening on port \${this.config.port}</div>
            </div>
          </body>
        </html>
      \`);
    });
  }

  public async start(): Promise<number> {
    return new Promise((resolve) => {
      this.server = this.app.listen(this.config.port, this.config.host, () => {
        console.log(\`[RENDER] Listening on \${this.config.host}:\${this.config.port}\`);
        this.setupGracefulTeardown();
        resolve(this.config.port);
      });
    });
  }

  private setupGracefulTeardown(): void {
    const drain = (signal: string) => {
      console.log(\`[RENDER] \${signal} received. Draining connections...\`);
      this.isDraining = true;
      this.server?.close(() => {
        console.log('[RENDER] Teardown complete. Clean exit.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => drain('SIGTERM'));
    process.on('SIGINT', () => drain('SIGINT'));
  }
}

// Direct execution entrypoint
const server = new RenderAppServer();
server.start();
`,

  minimal: `/**
 * RENDER PLATFORM — MINIMAL MODERN CLASS ENTRYPOINT
 * File: index.ts
 */
import express from 'express';

export class RenderQuickApp {
  private app = express();
  private port = Number(process.env.PORT) || 3000;

  constructor() {
    this.app.get('/healthz', (_, res) => res.status(200).send('OK'));
    this.app.get('/', (_, res) => {
      res.json({
        message: 'Welcome to Render Modern Class Service',
        status: 'online',
        port: this.port
      });
    });
  }

  public listen() {
    return this.app.listen(this.port, '0.0.0.0', () => {
      console.log(\`Render service running on port \${this.port}\`);
    });
  }
}

new RenderQuickApp().listen();
`,

  fullstack: `/**
 * RENDER PLATFORM — FULL-STACK HYBRID CLASS (Vite + Express)
 * File: index.ts
 */
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class RenderFullStackApp {
  private app = express();
  private port = Number(process.env.PORT) || 3000;

  constructor() {
    this.app.use(express.json());

    // API Routes
    this.app.get('/healthz', (_, res) => res.json({ status: 'ok' }));
    this.app.get('/api/user', (_, res) => res.json({ authenticated: true, tier: 'enterprise' }));

    // Static Assets from Vite Build
    const distPath = path.join(__dirname, 'dist');
    this.app.use(express.static(distPath));

    // Client-side Routing Fallback
    this.app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  public start() {
    this.app.listen(this.port, '0.0.0.0', () => {
      console.log(\`Full-stack app active on 0.0.0.0:\${this.port}\`);
    });
  }
}

new RenderFullStackApp().start();
`,

  worker: `/**
 * RENDER PLATFORM — BACKGROUND CRON & WORKER CLASS
 * File: index.ts
 */
export class RenderWorkerService {
  private intervalTimer: NodeJS.Timeout | null = null;
  private isProcessing: boolean = false;

  public async startWorker() {
    console.log('[RENDER-WORKER] Background processor initialized.');
    
    // Heartbeat every 10 seconds
    this.intervalTimer = setInterval(async () => {
      if (this.isProcessing) return;
      this.isProcessing = true;
      try {
        await this.processJobQueue();
      } finally {
        this.isProcessing = false;
      }
    }, 10000);

    process.on('SIGTERM', () => this.shutdown());
  }

  private async processJobQueue() {
    console.log(\`[RENDER-WORKER] Processing batch at \${new Date().toISOString()}\`);
    // Execute queue workload here
  }

  private shutdown() {
    console.log('[RENDER-WORKER] Shutting down cleanly...');
    if (this.intervalTimer) clearInterval(this.intervalTimer);
    process.exit(0);
  }
}

new RenderWorkerService().startWorker();
`
};

export const RENDER_YAML_SPEC = `# render.yaml — Render Infrastructure as Code Blueprint
services:
  - type: web
    name: modern-render-app
    runtime: node
    plan: starter
    region: oregon # or frankfurt, singapore, ohio
    buildCommand: npm install && npm run build
    startCommand: npx tsx index.ts
    healthCheckPath: /healthz
    autoDeploy: true
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: RENDER_SERVICE_NAME
        value: modern-render-app
`;

export const ARCHITECTURE_STEPS = [
  {
    step: 1,
    title: 'Client Request Ingress',
    description: 'HTTPS request arrives at Render Global Edge Anycast Network with automated TLS termination.',
    icon: 'Globe',
    tech: 'HTTP/2 · SSL / TLS'
  },
  {
    step: 2,
    title: 'Container Ingress & Port Mapping',
    description: 'Render internal routing proxies the request to the container bound on 0.0.0.0:$PORT.',
    icon: 'Server',
    tech: 'Internal Private Mesh'
  },
  {
    step: 3,
    title: 'RenderAppServer Class Pipeline',
    description: 'Encapsulated TypeScript class evaluates route handlers, health monitor, and telemetry.',
    icon: 'Code2',
    tech: 'TypeScript OOP · Express'
  },
  {
    step: 4,
    title: 'Dynamic SSR / JSON Payload Delivery',
    description: 'Headers, metrics, and rendered payload stream back with sub-5ms internal latency.',
    icon: 'Zap',
    tech: 'JSON / HTML Response'
  }
];
