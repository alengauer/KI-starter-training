import { once } from 'node:events';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { DatabaseSync } from 'node:sqlite';
import express from 'express';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createSqliteCustomerStore, type CustomerStore } from './customer-store.ts';
import { createLoginThrottle } from './login-throttle.ts';
import { hashPassword } from './password-hash.ts';
import { createSessionRouter } from './session.ts';
import { SESSION_DURATION_MS, createSqliteSessionStore } from './session-store.ts';

const NOW = new Date('2026-09-26T10:00:00Z');
const PASSWORD = 'Sneaker1!';
const INVALID = { error: 'E-Mail-Adresse oder Passwort ist falsch' };
const PROFILE = {
  salutation: 'mr',
  firstName: 'Max',
  lastName: 'Mustermann',
  street: 'Bahnhofsplatz',
  houseNumber: '1',
  postalCode: '96444',
  city: 'Coburg',
  email: 'max@example.de',
  phone: null,
} as const;

describe('F08 API Anmeldung – /api/session (UC 1.5.1–1.5.4)', () => {
  let passwordHash: string;
  let customers: CustomerStore;
  let server: Server;
  let baseUrl: string;
  let currentTime: Date;

  beforeAll(async () => {
    passwordHash = await hashPassword(PASSWORD);
  });

  async function start(appBaseUrl = 'http://localhost:5173') {
    const db = new DatabaseSync(':memory:');
    customers = createSqliteCustomerStore(db);
    const router = createSessionRouter({
      customers,
      sessions: createSqliteSessionStore(db),
      loginThrottle: createLoginThrottle(),
      appBaseUrl,
      now: () => currentTime,
    });
    server = express().use(router).listen(0);
    await once(server, 'listening');
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  }

  async function addCustomer(email: string, { active = true } = {}) {
    const id = await customers.create({
      ...PROFILE,
      email,
      passwordHash,
      activationTokenHash: `token-${email}`,
      createdAt: NOW,
      activationExpiresAt: new Date(NOW.getTime() + 24 * 60 * 60 * 1000),
    });
    if (active) await customers.activate(id);
  }

  const login = (email: string, password = PASSWORD) =>
    fetch(`${baseUrl}/api/session`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  const sessionCookie = (response: Response) => response.headers.getSetCookie()[0]?.split(';')[0] ?? '';
  const withCookie = (cookie: string, method = 'GET') => fetch(`${baseUrl}/api/session`, { method, headers: { cookie } });
  const signedInCustomer = async (cookie: string) => {
    const response = await withCookie(cookie);
    expect(response.status).toBe(200);
    return ((await response.json()) as { customer: unknown }).customer;
  };

  beforeEach(async () => {
    currentTime = NOW;
    await start();
    await addCustomer('max@example.de');
  });

  afterEach(async () => {
    server.close();
    await once(server, 'close');
  });

  it('meldet ein aktiviertes Konto an und setzt ein HttpOnly-Sitzungs-Cookie', async () => {
    const response = await login('max@example.de');

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ customer: PROFILE });
    const cookie = response.headers.getSetCookie()[0] ?? '';
    expect(cookie).toMatch(/^sneakerstudio_session=[\w-]{43};/);
    expect(cookie).toContain('Max-Age=28800');
    expect(cookie).toContain('Path=/');
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('SameSite=Lax');
    expect(cookie).not.toContain('Secure');
  });

  it('setzt das Cookie mit "Secure", wenn die App über https läuft', async () => {
    server.close();
    await start('https://sneakerstudio.example');
    await addCustomer('max@example.de');

    expect((await login('max@example.de')).headers.getSetCookie()[0]).toContain('Secure');
  });

  it('akzeptiert die E-Mail-Adresse unabhängig von Groß-/Kleinschreibung und Leerzeichen', async () => {
    expect((await login(' MAX@Example.de ')).status).toBe(200);
  });

  it('antwortet bei falschem Passwort und unbekannter E-Mail gleich – 401 ohne Cookie', async () => {
    for (const response of [await login('max@example.de', 'Falsch1!'), await login('erika@example.de')]) {
      expect(response.status).toBe(401);
      expect(await response.json()).toEqual(INVALID);
      expect(response.headers.getSetCookie()).toEqual([]);
    }
  });

  it('meldet ein nicht aktiviertes Konto nur mit richtigem Passwort als solches (403)', async () => {
    await addCustomer('neu@example.de', { active: false });

    const correct = await login('neu@example.de');
    expect(correct.status).toBe(403);
    expect(await correct.json()).toEqual({
      error: 'Bitte bestätige zuerst deine E-Mail-Adresse über den Link in unserer E-Mail.',
    });
    expect((await login('neu@example.de', 'Falsch1!')).status).toBe(401);
  });

  it('sperrt nach 5 Fehlversuchen – auch das richtige Passwort (429)', async () => {
    for (let attempt = 0; attempt < 5; attempt++) await login('max@example.de', 'Falsch1!');

    const response = await login('max@example.de');
    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({ error: 'Zu viele Anmeldeversuche. Bitte versuche es in 15 Minuten erneut.' });
  });

  it('liefert per GET die Kontaktdaten der angemeldeten Person – ohne Passwort', async () => {
    const cookie = sessionCookie(await login('max@example.de'));
    const response = await withCookie(cookie);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ customer: PROFILE });
  });

  it.each(['', 'sneakerstudio_session=falsch', 'anderes=cookie'])('meldet ohne gültige Sitzung (%j) niemanden als angemeldet', async (cookie) => {
    expect(await signedInCustomer(cookie)).toBeNull();
  });

  it('beendet die Sitzung per DELETE und löscht das Cookie (UC 1.5.4)', async () => {
    const cookie = sessionCookie(await login('max@example.de'));
    const response = await withCookie(cookie, 'DELETE');

    expect(response.status).toBe(204);
    expect(response.headers.getSetCookie()[0]).toMatch(/^sneakerstudio_session=;.*Expires=Thu, 01 Jan 1970/);
    expect(await signedInCustomer(cookie)).toBeNull();
  });

  it('beendet die Sitzung automatisch nach 8 Stunden (UC 1.5.4)', async () => {
    const cookie = sessionCookie(await login('max@example.de'));
    currentTime = new Date(NOW.getTime() + SESSION_DURATION_MS);

    expect(await signedInCustomer(cookie)).toBeNull();
  });
});
