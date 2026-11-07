import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Serves POST /api/contact in local dev using the same handler as the
// Vercel serverless function (api/contact.js), so Resend local testing
// matches production. Server env comes from .env.local via loadEnv.
const contactApiDev = {
  name: 'contact-api-dev',
  configureServer(server: any) {
    const env = loadEnv(server.config.mode || 'development', process.cwd(), '');
    for (const key of ['RESEND_API_KEY', 'RESEND_FROM', 'CONTACT_TO_EMAIL']) {
      if (env[key] && !process.env[key]) process.env[key] = env[key];
    }
    server.middlewares.use('/api/contact', async (req: any, res: any) => {
      try {
        const { default: handler } = await import('./api/contact.js');
        await handler(req, res);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'dev_handler_failed' }));
      }
    });
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), contactApiDev],
  build: { sourcemap: false, chunkSizeWarningLimit: 600, rollupOptions: { output: { manualChunks: { 'vendor-react': ['react', 'react-dom'], 'vendor-motion': ['framer-motion'] } } } },
  server: {
    port: 3000,
    host: true
  }
});
