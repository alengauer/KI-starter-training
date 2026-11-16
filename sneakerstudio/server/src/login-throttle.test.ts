import { beforeEach, describe, expect, it } from 'vitest';
import { LOCK_PERIOD_MS, createLoginThrottle, type LoginThrottle } from './login-throttle.ts';

const NOW = new Date('2026-09-26T10:00:00Z');
const MINUTE = 60 * 1000;
const at = (offset: number) => new Date(NOW.getTime() + offset);

describe('F08 Schutz vor Passwort-Raten (UC 1.5.3)', () => {
  let throttle: LoginThrottle;
  const fail = (times: number, email = 'max@example.de', start = 0) => {
    for (let i = 0; i < times; i++) throttle.recordFailure(email, at(start + i * MINUTE));
  };

  beforeEach(() => {
    throttle = createLoginThrottle();
  });

  it('erlaubt Anmeldeversuche bei weniger als 5 Fehlversuchen', () => {
    fail(4);

    expect(throttle.isLocked('max@example.de', at(4 * MINUTE))).toBe(false);
  });

  it('sperrt nach 5 Fehlversuchen innerhalb von 15 Minuten', () => {
    fail(5);

    expect(throttle.isLocked('max@example.de', at(4 * MINUTE))).toBe(true);
  });

  it('sperrt genau 15 Minuten ab dem 5. Fehlversuch', () => {
    fail(5);
    const fifth = 4 * MINUTE;

    expect(LOCK_PERIOD_MS).toBe(15 * MINUTE);
    expect(throttle.isLocked('max@example.de', at(fifth + LOCK_PERIOD_MS - 1))).toBe(true);
    expect(throttle.isLocked('max@example.de', at(fifth + LOCK_PERIOD_MS))).toBe(false);
  });

  it('zählt nur Fehlversuche der letzten 15 Minuten', () => {
    fail(4);
    fail(1, 'max@example.de', 15 * MINUTE);

    expect(throttle.isLocked('max@example.de', at(15 * MINUTE))).toBe(false);
  });

  it('gilt je E-Mail-Adresse, unabhängig von Groß-/Kleinschreibung', () => {
    fail(5, 'Max@Example.de');

    expect(throttle.isLocked('max@example.de', at(5 * MINUTE))).toBe(true);
    expect(throttle.isLocked('erika@example.de', at(5 * MINUTE))).toBe(false);
  });

  it('setzt die Fehlversuche nach einer erfolgreichen Anmeldung zurück', () => {
    fail(4);
    throttle.reset('max@example.de');
    fail(1, 'max@example.de', 5 * MINUTE);

    expect(throttle.isLocked('max@example.de', at(5 * MINUTE))).toBe(false);
  });
});
