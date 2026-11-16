import { scryptSync } from 'node:crypto';
import { beforeAll, describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './password-hash.ts';

describe('F04 Passwort sicher speichern (UC 1.2.1)', () => {
  it('speichert das Passwort nicht im Klartext', async () => {
    const hash = await hashPassword('Sneaker1!');

    expect(hash).not.toContain('Sneaker1!');
    expect(hash).toMatch(/^scrypt\$16384\$8\$5\$[\w-]{22}\$[\w-]{86}$/);
  });

  it('erzeugt für dasselbe Passwort unterschiedliche Hashes (zufälliges Salt)', async () => {
    const [first, second] = await Promise.all([hashPassword('Sneaker1!'), hashPassword('Sneaker1!')]);

    expect(first).not.toBe(second);
  });

  it('lässt sich mit den gespeicherten Parametern nachrechnen', async () => {
    const hash = await hashPassword('Sneaker1!');
    const [, N, r, p, salt, key] = hash.split('$') as [string, string, string, string, string, string];

    const expected = scryptSync('Sneaker1!', Buffer.from(salt, 'base64url'), 64, {
      N: Number(N),
      r: Number(r),
      p: Number(p),
    });
    expect(key).toBe(expected.toString('base64url'));
  });
});

describe('F08 Passwort prüfen (UC 1.5.1)', () => {
  let stored: string;

  beforeAll(async () => {
    stored = await hashPassword('Sneaker1!');
  });

  it('erkennt das richtige Passwort', async () => {
    expect(await verifyPassword('Sneaker1!', stored)).toBe(true);
  });

  it.each(['Sneaker1?', 'sneaker1!', 'Sneaker1! ', ''])('lehnt das falsche Passwort "%s" ab', async (attempt) => {
    expect(await verifyPassword(attempt, stored)).toBe(false);
  });

  it('nutzt die im Hash gespeicherten Parameter', async () => {
    const salt = Buffer.from('0123456789abcdef');
    const key = scryptSync('Sneaker1!', salt, 64, { N: 1024, r: 8, p: 1 });
    const olderHash = ['scrypt', 1024, 8, 1, salt.toString('base64url'), key.toString('base64url')].join('$');

    expect(await verifyPassword('Sneaker1!', olderHash)).toBe(true);
  });

  it.each(['', 'kaputt', 'scrypt$16384$8$5', 'bcrypt$16384$8$5$c2FsdA$a2V5', 'scrypt$16384$8$5$c2FsdA$'])(
    'lehnt den beschädigten Hash "%s" ab',
    async (damaged) => {
      expect(await verifyPassword('Sneaker1!', damaged)).toBe(false);
    },
  );

  it('lehnt einen Hash mit ungültigen Parametern ab, ohne abzustürzen', async () => {
    const [scheme, , r, p, salt, key] = stored.split('$');

    expect(await verifyPassword('Sneaker1!', [scheme, 'abc', r, p, salt, key].join('$'))).toBe(false);
  });
});
