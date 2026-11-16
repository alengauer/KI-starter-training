// Sichere Speicherung des Passworts (F04, UC 1.2.1 „damit ich mein Konto schützen kann“).
// scrypt aus node:crypto mit OWASP-Mindestparametern und zufälligem Salt je Konto.
// Gespeichert wird nur "scrypt$N$r$p$<salt>$<hash>" – die Parameter erlauben die Prüfung beim Login (F08).

import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

type Cost = { N: number; r: number; p: number };

const COST: Cost = { N: 16384, r: 8, p: 5 };
const SALT_BYTES = 16;
const KEY_BYTES = 64;

function deriveKey(password: string, salt: Buffer, cost: Cost): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_BYTES, cost, (error, key) => (error ? reject(error) : resolve(key)));
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const key = await deriveKey(password, salt, COST);
  return ['scrypt', COST.N, COST.r, COST.p, salt.toString('base64url'), key.toString('base64url')].join('$');
}

// Anmeldung (F08, UC 1.5.1): rechnet mit den gespeicherten Parametern nach und vergleicht zeitkonstant.
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, N, r, p, salt, key, ...rest] = stored.split('$');
  if (scheme !== 'scrypt' || rest.length > 0 || !salt || !key) return false;
  const expected = Buffer.from(key, 'base64url');
  if (expected.length !== KEY_BYTES) return false;
  try {
    const actual = await deriveKey(password, Buffer.from(salt, 'base64url'), {
      N: Number(N),
      r: Number(r),
      p: Number(p),
    });
    return timingSafeEqual(actual, expected);
  } catch {
    return false; // ungültige Parameter im gespeicherten Hash
  }
}
