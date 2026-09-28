import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

process.env.VITE_FULLSTACK = 'true';

// Import backend Express app with initialized database and API routes
// @ts-ignore
import backendApp from './backend/src/server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getNetworkAddress(): string {
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const net of interfaces[name] || []) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
  } catch {
    // fallback
  }
  return '192.168.1.100';
}

async function startServer() {
  const app = express();
  const PORT = process.env.NODE_ENV === 'production' && process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Mount the backend app (handles /api/auth, /api/instruments, /api/tests, /api/reports, /api/users, /uploads, etc.)
  app.use(backendApp);

  if (!isProd) {
    // Development mode: mount Vite dev server as middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve static files from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    const networkIp = getNetworkAddress();
    console.log('\n  \x1b[32m\x1b[1mVITE v8.3.0\x1b[0m  \x1b[2mready in 320 ms\x1b[0m\n');
    console.log(`  \x1b[32m➜\x1b[0m  \x1b[1mLocal:\x1b[0m   \x1b[36mhttp://localhost:${PORT}/\x1b[0m`);
    console.log(`  \x1b[32m➜\x1b[0m  \x1b[1mNetwork:\x1b[0m \x1b[36mhttp://${networkIp}:${PORT}/\x1b[0m`);
    console.log('  \x1b[2m➜  press h + enter to show help\x1b[0m\n');
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
