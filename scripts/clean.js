import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const targets = ['dist', 'dist-admin', 'server.js'];

targets.forEach((target) => {
  const fullPath = path.join(root, target);
  try {
    if (fs.existsSync(fullPath)) {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`[Clean] Removed: ${target}`);
    }
  } catch (err) {
    console.error(`[Clean Error] Failed to remove ${target}:`, err.message);
  }
});

console.log('[Clean] Cleanup completed.');
