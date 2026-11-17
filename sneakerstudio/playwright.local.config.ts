// Lokale Variante von playwright.config.ts für Rechner, auf denen Port 3000 belegt ist (z. B. durch OpenWebUI).
// Die API läuft auf API_PORT (Standard 3100). playwright.config.ts bleibt unverändert.
// Aufruf: npx playwright test -c playwright.local.config.ts
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { defineConfig, devices } from '@playwright/test';

process.env.E2E_DATA_DIR ??= mkdtempSync(join(tmpdir(), 'sneakerstudio-e2e-'));
const dataDir = process.env.E2E_DATA_DIR;
const apiPort = process.env.API_PORT ?? '3100';

export default defineConfig({
  testDir: 'e2e',
  use: { baseURL: 'http://localhost:5173' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'npm start -w server',
      port: Number(apiPort),
      env: { PORT: apiPort, DB_PATH: join(dataDir, 'sneakerstudio.db'), OUTBOX_DIR: join(dataDir, 'outbox') },
      reuseExistingServer: false,
    },
    {
      // Kein laufender Client wird übernommen: Er könnte /api noch an Port 3000 weiterleiten.
      command: 'npm run dev -w client -- --config vite.local.config.ts',
      url: 'http://localhost:5173',
      env: { API_PORT: apiPort },
      reuseExistingServer: false,
    },
  ],
});
