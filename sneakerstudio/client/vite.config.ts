import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Fester Port: Die Aktivierungslinks in den Bestätigungsmails zeigen auf http://localhost:5173.
    port: 5173,
    strictPort: true,
    // API-Aufrufe an den Express-Server weiterleiten (F05, F06).
    proxy: { '/api': 'http://localhost:3000' },
  },
  test: {
    name: 'client',
    environment: 'jsdom',
    // styles.css freigeben, damit der Token-Test die Datei als Text (?raw) lesen kann.
    css: { include: [/styles\.css/] },
  },
});
