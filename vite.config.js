import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/logo.png', 'assets/logo1.png', 'robots.txt', 'sitemap.xml', 'llms.txt'],
      manifest: {
        id: '/',
        name: 'Tynor — Catálogo Médico Interactivo',
        short_name: 'Tynor Kiosk',
        description: 'Catálogo Interactivo de Ortopedia y Rehabilitación para EXPOMEDICAL',
        start_url: '/',
        scope: '/',
        theme_color: '#10B4C1',
        background_color: '#F1F5F9',
        display: 'standalone',
        orientation: 'any',
        categories: ['medical', 'business', 'shopping'],
        icons: [
          {
            src: '/assets/logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/assets/logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/assets/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/assets/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Catálogo General',
            short_name: 'Catálogo',
            description: 'Explora productos de ortopedia y biomecánica',
            url: '/',
            icons: [{ src: '/assets/logo.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        // Solo precachear el shell de la aplicación (HTML, CSS, JS core e íconos indispensables)
        globPatterns: ['**/*.{js,css,html,svg,ico,woff2}', 'assets/logo*.png'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        runtimeCaching: [
          // Caché bajo demanda de imágenes de catálogo (con política CacheFirst y expiración a 30 días)
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/assets/') && url.pathname.endsWith('.png'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'product-images-cache',
              expiration: {
                maxEntries: 250,
                maxAgeSeconds: 60 * 60 * 24 * 30
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // Modelos 3D GLB con soporte de Range Requests
          {
            urlPattern: ({ url }) => url.pathname.endsWith('.glb'),
            handler: 'CacheFirst',
            options: {
              cacheName: '3d-models-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 60
              },
              rangeRequests: true,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // Fichas técnicas PDF
          {
            urlPattern: ({ url }) => url.pathname.endsWith('.pdf'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'pdf-fichas-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // Fuentes Google Fonts
          {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-icons': ['lucide-react'],
          'vendor-confetti': ['canvas-confetti'],
          'vendor-jspdf': ['jspdf', 'jspdf-autotable']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
});
