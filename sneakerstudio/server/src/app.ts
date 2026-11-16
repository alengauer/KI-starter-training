// Zusammenbau des Servers (F05, F06, F08): API-Router, Kundenstamm und Sitzungen (SQLite-Datei),
// Datei-Postfach, Aufräum-Job.

import { once } from 'node:events';
import { mkdir } from 'node:fs/promises';
import type { AddressInfo } from 'node:net';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import express, { type Express } from 'express';
import { createActivationRouter, startExpiredAccountCleanup } from './activation.ts';
import { createSqliteCustomerStore } from './customer-store.ts';
import { createLoginThrottle } from './login-throttle.ts';
import { createFileMailer } from './mailer.ts';
import { createRegistrationRouter, type RegistrationDeps } from './registration.ts';
import { createSessionRouter, type SessionDeps } from './session.ts';
import { createSqliteSessionStore } from './session-store.ts';

export type ServerConfig = {
  port: number;
  dbPath: string;
  outboxDir: string;
  appBaseUrl: string;
};

export function createApp(deps: RegistrationDeps & SessionDeps): Express {
  return express()
    .use(createRegistrationRouter(deps))
    .use(createActivationRouter(deps))
    .use(createSessionRouter(deps));
}

export async function startServer(config: ServerConfig): Promise<{ url: string; close: () => Promise<void> }> {
  await mkdir(dirname(config.dbPath), { recursive: true });
  const db = new DatabaseSync(config.dbPath);
  const customers = createSqliteCustomerStore(db);
  const now = () => new Date();
  const stopCleanup = startExpiredAccountCleanup(customers, now);

  const app = createApp({
    customers,
    sessions: createSqliteSessionStore(db),
    loginThrottle: createLoginThrottle(),
    mailer: createFileMailer(config.outboxDir),
    appBaseUrl: config.appBaseUrl,
    now,
  });
  const server = app.listen(config.port);
  await once(server, 'listening');

  return {
    url: `http://localhost:${(server.address() as AddressInfo).port}`,
    async close() {
      stopCleanup();
      server.close();
      await once(server, 'close');
      db.close();
    },
  };
}
