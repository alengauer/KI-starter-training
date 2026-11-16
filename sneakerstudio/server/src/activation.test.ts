import { once } from 'node:events';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { DatabaseSync } from 'node:sqlite';
import express from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ACTIVATION_PERIOD_MS,
  createActivationRouter,
  createActivationToken,
  startExpiredAccountCleanup,
} from './activation.ts';
import { createSqliteCustomerStore } from './customer-store.ts';

const NOW = new Date('2026-09-25T10:00:00Z');
const ONE_HOUR = 60 * 60 * 1000;
const at = (offset: number) => new Date(NOW.getTime() + offset);

describe('F06 API Kontoaktivierung – POST /api/activations (Fachkonzept 1.3)', () => {
  let db: DatabaseSync;
  let server: Server;
  let baseUrl: string;
  let currentTime: Date;
  let token: string;

  beforeEach(async () => {
    db = new DatabaseSync(':memory:');
    const customers = createSqliteCustomerStore(db);
    const activation = createActivationToken();
    token = activation.token;
    currentTime = NOW;
    await customers.create({
      salutation: 'ms',
      firstName: 'Erika',
      lastName: 'Mustermann',
      street: 'Hauptstraße',
      houseNumber: '12a',
      postalCode: '10115',
      city: 'Berlin',
      email: 'erika@example.de',
      phone: null,
      passwordHash: 'scrypt$hash',
      activationTokenHash: activation.tokenHash,
      createdAt: NOW,
      activationExpiresAt: at(ACTIVATION_PERIOD_MS),
    });
    server = express()
      .use(createActivationRouter({ customers, now: () => currentTime }))
      .listen(0);
    await once(server, 'listening');
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  afterEach(async () => {
    server.close();
    await once(server, 'close');
  });

  const activate = (body: unknown) =>
    fetch(`${baseUrl}/api/activations`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
  const storedStatus = () => db.prepare('SELECT status FROM customers').get()?.status;

  it('aktiviert das Konto, wenn der Link innerhalb von 24 Stunden geklickt wird', async () => {
    currentTime = at(ACTIVATION_PERIOD_MS - 1);
    const response = await activate({ token });

    expect(response.status).toBe(200);
    expect(storedStatus()).toBe('active');
  });

  it('antwortet auch beim erneuten Klick mit 200 – auch nach Ablauf der 24 Stunden', async () => {
    currentTime = at(ONE_HOUR);
    await activate({ token });
    currentTime = at(ACTIVATION_PERIOD_MS + ONE_HOUR);
    const response = await activate({ token });

    expect(response.status).toBe(200);
    expect(storedStatus()).toBe('active');
  });

  it('löscht das Konto und antwortet mit 410, wenn der Link abgelaufen ist', async () => {
    currentTime = at(ACTIVATION_PERIOD_MS);
    const response = await activate({ token });

    expect(response.status).toBe(410);
    expect(db.prepare('SELECT COUNT(*) AS count FROM customers').get()).toEqual({ count: 0 });
  });

  it.each([{ token: 'unbekannt' }, { token: '' }, {}])('antwortet bei unbekanntem Link %j mit 404', async (body) => {
    const response = await activate(body);

    expect(response.status).toBe(404);
    expect(storedStatus()).toBe('pending');
  });
});

describe('F06 Automatische Löschung – Aufräum-Job (Fachkonzept 1.3)', () => {
  const INTERVAL = 15 * 60 * 1000;

  afterEach(() => {
    vi.useRealTimers();
  });

  it('löscht alle 15 Minuten abgelaufene, nicht aktivierte Konten', async () => {
    vi.useFakeTimers();
    const deleteExpiredPending = vi.fn().mockResolvedValue(0);
    const stop = startExpiredAccountCleanup({ deleteExpiredPending }, () => NOW);

    await vi.advanceTimersByTimeAsync(INTERVAL - 1);
    expect(deleteExpiredPending).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(deleteExpiredPending).toHaveBeenCalledExactlyOnceWith(NOW);

    stop();
    await vi.advanceTimersByTimeAsync(INTERVAL);
    expect(deleteExpiredPending).toHaveBeenCalledTimes(1);
  });

  it('protokolliert Fehler, statt den Server zu beenden', async () => {
    vi.useFakeTimers();
    const error = new Error('Datenbank gesperrt');
    const log = vi.fn();
    const stop = startExpiredAccountCleanup({ deleteExpiredPending: vi.fn().mockRejectedValue(error) }, () => NOW, log);

    await vi.advanceTimersByTimeAsync(INTERVAL);
    expect(log).toHaveBeenCalledWith('Aufräumen nicht aktivierter Konten fehlgeschlagen', error);
    stop();
  });
});
