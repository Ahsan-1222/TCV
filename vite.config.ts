import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { sendOrderEmail } from './api/emailHandler.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  // Expose server-side environment variables strictly to Node.js process environment
  if (env.RESEND_API_KEY) process.env.RESEND_API_KEY = env.RESEND_API_KEY;
  if (env.ADMIN_EMAIL) process.env.ADMIN_EMAIL = env.ADMIN_EMAIL;
  if (env.EMAIL_FROM) process.env.EMAIL_FROM = env.EMAIL_FROM;

  return {
    plugins: [
      react(),
      {
        name: 'order-email-api-plugin',
        configureServer(server) {
          server.middlewares.use('/api/send-order-email', async (req, res, next) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });
              req.on('end', async () => {
                try {
                  const orderData = body ? JSON.parse(body) : {};
                  const result = await sendOrderEmail(orderData);
                  res.statusCode = result.success ? 200 : 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(result));
                } catch (err) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ 
                    success: false, 
                    error: err instanceof Error ? err.message : 'Invalid JSON request body' 
                  }));
                }
              });
            } else {
              next();
            }
          });
        }
      }
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('framer-motion')) return 'motion'
              if (id.includes('lucide-react')) return 'icons'
              if (id.includes('react') || id.includes('react-router')) return 'vendor'
              return 'vendor'
            }
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
    server: {
      port: 5173,
      host: true,
    },
    optimizeDeps: {
      include: ['gsap', 'framer-motion', 'lucide-react'],
    },
  };
});
