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
        name: 'admin-root-redirect',
        configureServer(server) {
          server.middlewares.use((req, _res, next) => {
            if (req.url === '/' || req.url === '') {
              req.url = '/admin.html';
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      port: 3001,
      host: '0.0.0.0',
      open: false,
    },
    build: {
      outDir: 'dist-admin',
      rollupOptions: {
        input: path.resolve(import.meta.dirname, 'admin.html'),
      },
    },
  };
});
