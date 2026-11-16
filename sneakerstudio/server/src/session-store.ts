// Sitzungen (F08, UC 1.5.1 und 1.5.4): Der Token steht nur im Cookie des Kunden;
// gespeichert wird sein SHA-256-Hash. Eine Sitzung gilt 8 Stunden.

import { createHash, randomBytes } from 'node:crypto';
import type { DatabaseSync } from 'node:sqlite';

export const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

export interface SessionStore {
  create(customerId: string, now: Date): Promise<string>;
  findCustomerId(token: string, now: Date): Promise<string | null>;
  delete(token: string): Promise<void>;
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function createSqliteSessionStore(db: DatabaseSync): SessionStore {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    )
  `);

  const insert = db.prepare('INSERT INTO sessions (token_hash, customer_id, expires_at) VALUES (?, ?, ?)');
  const findValid = db.prepare('SELECT customer_id FROM sessions WHERE token_hash = ? AND expires_at > ?');
  const remove = db.prepare('DELETE FROM sessions WHERE token_hash = ?');

  return {
    async create(customerId, now) {
      const token = randomBytes(32).toString('base64url');
      insert.run(hashToken(token), customerId, now.getTime() + SESSION_DURATION_MS);
      return token;
    },

    async findCustomerId(token, now) {
      const row = findValid.get(hashToken(token), now.getTime());
      return row ? String(row.customer_id) : null;
    },

    async delete(token) {
      remove.run(hashToken(token));
    },
  };
}
