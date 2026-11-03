import fs from 'fs';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'render-root-redirect',
        closeBundle() {
          const renderPath = path.resolve(import.meta.dirname, 'server/public/render.html');
          const indexPath = path.resolve(import.meta.dirname, 'server/public/index.html');
          try {
            if (fs.existsSync(renderPath)) {
              fs.copyFileSync(renderPath, indexPath);
            }
          } catch {
            // ignore
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      port: 3002,
      host: '0.0.0.0',
      open: false,
    },
    build: {
      outDir: 'server/public',
      emptyOutDir: true,
      rollupOptions: {
        input: path.resolve(import.meta.dirname, 'render.html'),
      },
    },
  };
});
