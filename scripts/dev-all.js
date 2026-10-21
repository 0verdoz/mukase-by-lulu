import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

console.log('====================================================');
console.log(' 🍲 Mukase by Lulu — Multi-Instance Dev Runner');
console.log('====================================================');
console.log(' [1/3] Backend Sync Engine:   http://localhost:5000');
console.log(' [2/3] Customer Storefront:   http://localhost:3000');
console.log(' [3/3] Kitchen Admin Portal:  http://localhost:3001');
console.log('====================================================\n');

const services = [
  {
    name: 'SYNC-SERVER',
    cmd: process.platform === 'win32' ? 'npx.cmd' : 'npx',
    args: ['tsx', 'server/index.ts'],
    color: '\x1b[36m', // Cyan
  },
  {
    name: 'CUSTOMER-3000',
    cmd: process.platform === 'win32' ? 'npx.cmd' : 'npx',
    args: ['vite', '--port=3000', '--host=0.0.0.0'],
    color: '\x1b[32m', // Green
  },
  {
    name: 'ADMIN-3001',
    cmd: process.platform === 'win32' ? 'npx.cmd' : 'npx',
    args: ['vite', '--config', 'vite.admin.config.ts', '--port=3001', '--host=0.0.0.0'],
    color: '\x1b[33m', // Yellow
  },
];

const processes = [];

services.forEach((service) => {
  const proc = spawn(service.cmd, service.args, {
    cwd: root,
    shell: true,
    stdio: 'inherit',
    env: { ...process.env, FORCE_COLOR: '1' },
  });

  proc.on('error', (err) => {
    console.error(`[${service.name} Error]:`, err.message);
  });

  processes.push(proc);
});

function cleanup() {
  console.log('\n[Dev-All] Shutting down all services...');
  processes.forEach((proc) => {
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', proc.pid.toString(), '/f', '/t'], { shell: true });
      } else {
        proc.kill('SIGTERM');
      }
    } catch {
      // ignore
    }
  });
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
