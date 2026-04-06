import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    {
      name: 'spa-fallback',
      configureServer(server) {
        return () => {
          server.middlewares.use((req, res, next) => {
            // Skip API, auth routes and static assets
            if (req.url.startsWith('/api') || 
                req.url.startsWith('/auth') || 
                /\.(js|css|json|png|jpg|gif|svg|ico|woff|woff2|ttf|eot)$/i.test(req.url) ||
                req.url.includes('/@vite')) {
              return next();
            }
            // For all other requests (SPA routes), serve index.html
            if (req.url !== '/' && !req.url.includes('.')) {
              req.url = '/index.html';
            }
            next();
          });
        };
      }
    }
  ]
})
