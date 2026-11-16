import { createHash } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { beforeEach, describe, expect, it } from 'vitest';
import { SESSION_DURATION_MS, createSqliteSessionStore, type SessionStore } from './session-store.ts';

const NOW = new Date('2026-09-26T10:00:00Z');
const at = (offset: number) => new Date(NOW.getTime() + offset);

describe('F08 Sitzungen (UC 1.5.1, UC 1.5.4)', () => {
  let db: DatabaseSync;
  let sessions: SessionStore;

  beforeEach(() => {
    db = new DatabaseSync(':memory:');
    sessions = createSqliteSessionStore(db);
  });

  it('legt eine Sitzung an und findet den Kunden über den Token', async () => {
    const token = await sessions.create('kunde-1', NOW);

    expect(await sessions.findCustomerId(token, NOW)).toBe('kunde-1');
  });

  it('speichert den Token nur als SHA-256-Hash', async () => {
    const token = await sessions.create('kunde-1', NOW);

    expect(db.prepare('SELECT token_hash FROM sessions').all()).toEqual([
      { token_hash: createHash('sha256').update(token).digest('hex') },
    ]);
  });

  it('erzeugt für jede Anmeldung einen neuen, zufälligen Token', async () => {
    const first = await sessions.create('kunde-1', NOW);
    const second = await sessions.create('kunde-1', NOW);

    expect(first).not.toBe(second);
    expect(first).toMatch(/^[\w-]{43}$/);
  });

  it('gilt 8 Stunden und endet danach automatisch (UC 1.5.4)', async () => {
    const token = await sessions.create('kunde-1', NOW);

    expect(SESSION_DURATION_MS).toBe(8 * 60 * 60 * 1000);
    expect(await sessions.findCustomerId(token, at(SESSION_DURATION_MS - 1))).toBe('kunde-1');
    expect(await sessions.findCustomerId(token, at(SESSION_DURATION_MS))).toBeNull();
  });

  it('findet unbekannte Tokens nicht', async () => {
    expect(await sessions.findCustomerId('unbekannt', NOW)).toBeNull();
  });

  it('beendet eine Sitzung beim Abmelden (UC 1.5.4)', async () => {
    const token = await sessions.create('kunde-1', NOW);
    await sessions.delete(token);

    expect(await sessions.findCustomerId(token, NOW)).toBeNull();
  });
});
