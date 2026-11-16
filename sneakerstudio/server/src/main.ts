// Startet den SneakerStudio-Server. Konfiguration über Umgebungsvariablen, Standard: Daten unter server/data/.

import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { startServer } from './app.ts';

const dataDir = fileURLToPath(new URL('../data/', import.meta.url));
const env = process.env;

const { url } = await startServer({
  port: Number(env.PORT ?? 3000),
  dbPath: env.DB_PATH ?? join(dataDir, 'sneakerstudio.db'),
  outboxDir: env.OUTBOX_DIR ?? join(dataDir, 'outbox'),
  appBaseUrl: env.APP_BASE_URL ?? 'http://localhost:5173',
});
console.log(`SneakerStudio-Server läuft auf ${url}`);
