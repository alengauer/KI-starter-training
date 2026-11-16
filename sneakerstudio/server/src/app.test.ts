import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { startServer, type ServerConfig } from './app.ts';

const REGISTRATION = {
  salutation: 'ms',
  firstName: 'Erika',
  lastName: 'Mustermann',
  street: 'Hauptstraße',
  houseNumber: '12a',
  postalCode: '96444',
  city: 'Coburg',
  email: 'erika@example.de',
  phone: '',
  password: 'Sneaker1!',
};

describe('F05/F06/F08 Server gesamt – Registrierung bis Anmeldung', () => {
  let dir: string;
  let config: ServerConfig;
  let server: Awaited<ReturnType<typeof startServer>>;

  beforeEach(async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    dir = await mkdtemp(join(tmpdir(), 'sneakerstudio-server-'));
    config = {
      port: 0,
      dbPath: join(dir, 'data', 'sneakerstudio.db'),
      outboxDir: join(dir, 'outbox'),
      appBaseUrl: 'http://localhost:5173',
    };
    server = await startServer(config);
  });

  afterEach(async () => {
    await server.close();
    await rm(dir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  const post = (path: string, body: unknown) =>
    fetch(`${server.url}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });

  it('registriert einen Kunden und aktiviert das Konto über den Link aus dem Datei-Postfach', async () => {
    expect((await post('/api/registrations', REGISTRATION)).status).toBe(201);

    const [file] = await readdir(config.outboxDir);
    const mail = JSON.parse(await readFile(join(config.outboxDir, file ?? ''), 'utf8')) as { to: string; text: string };
    expect(mail.to).toBe('erika@example.de');
    const link = new URL(mail.text.match(/http\S+/)?.[0] ?? '');
    expect(`${link.origin}${link.pathname}`).toBe('http://localhost:5173/aktivieren');

    expect((await post('/api/activations', { token: link.searchParams.get('token') })).status).toBe(200);
  });

  it('meldet ein aktiviertes Konto an, liefert die Kontaktdaten und meldet wieder ab (F08)', async () => {
    await post('/api/registrations', REGISTRATION);
    const [file] = await readdir(config.outboxDir);
    const { text } = JSON.parse(await readFile(join(config.outboxDir, file ?? ''), 'utf8')) as { text: string };
    await post('/api/activations', { token: new URL(text.match(/http\S+/)?.[0] ?? '').searchParams.get('token') });

    const login = await post('/api/session', { email: 'erika@example.de', password: 'Sneaker1!' });
    expect(login.status).toBe(200);
    const cookie = login.headers.getSetCookie()[0]?.split(';')[0] ?? '';

    const session = await fetch(`${server.url}/api/session`, { headers: { cookie } });
    expect(await session.json()).toMatchObject({ customer: { salutation: 'ms', lastName: 'Mustermann', city: 'Coburg' } });

    expect((await fetch(`${server.url}/api/session`, { method: 'DELETE', headers: { cookie } })).status).toBe(204);
    expect(await (await fetch(`${server.url}/api/session`, { headers: { cookie } })).json()).toEqual({ customer: null });
  });

  it('behält registrierte Kunden über einen Neustart (SQLite-Datei)', async () => {
    await post('/api/registrations', REGISTRATION);
    await server.close();
    server = await startServer(config);

    expect((await post('/api/registrations', REGISTRATION)).status).toBe(409);
  });
});
