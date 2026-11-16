import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { defineConfig, devices } from '@playwright/test';

// Jeder Testlauf bekommt eine frische Datenbank und ein leeres Datei-Postfach.
// Über die Umgebungsvariable sehen auch die Tests (Worker-Prozesse) denselben Ordner.
process.env.E2E_DATA_DIR ??= mkdtempSync(join(tmpdir(), 'sneakerstudio-e2e-'));
const dataDir = process.env.E2E_DATA_DIR;

export default defineConfig({
  testDir: 'e2e',
  use: { baseURL: 'http://localhost:5173' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'npm start -w server',
      port: 3000,
      env: { DB_PATH: join(dataDir, 'sneakerstudio.db'), OUTBOX_DIR: join(dataDir, 'outbox') },
      // Nie einen laufenden Entwicklungs-Server nutzen – der hätte andere Daten und ein anderes Postfach.
      reuseExistingServer: false,
    },
    {
      command: 'npm run dev -w client',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
    },
  ],
});
