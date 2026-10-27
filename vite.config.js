import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/**/*', 'pdf/**/*', 'video/**/*'],
      manifest: {
        name: 'Tynor — Catálogo Médico Interactivo',
        short_name: 'Tynor Kiosk',
        description: 'Catálogo Interactivo de Ortopedia y Rehabilitación para EXPOMEDICAL',
        theme_color: '#10B4C1',
        background_color: '#F1F5F9',
        display: 'standalone',
        orientation: 'any',
        icons: [
          {
            src: '/assets/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/assets/logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 120 * 1024 * 1024, // 120 MB para cubrir Model_Human.glb (~68MB)
        globPatterns: ['**/*.{js,css,html,png,svg,glb,pdf,mp4}']
      }
    })
  ],
  server: {
    port: 3000,
    host: true
  }
});
