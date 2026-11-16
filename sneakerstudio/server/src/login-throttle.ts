// Schutz vor Passwort-Raten (F08, UC 1.5.3): Nach 5 Fehlversuchen je E-Mail-Adresse innerhalb von 15 Minuten
// sind weitere Anmeldeversuche 15 Minuten lang gesperrt. Die Zähler liegen im Arbeitsspeicher.

export const MAX_FAILED_ATTEMPTS = 5;
export const LOCK_PERIOD_MS = 15 * 60 * 1000;

export type LoginThrottle = {
  isLocked(email: string, now: Date): boolean;
  recordFailure(email: string, now: Date): void;
  reset(email: string): void;
};

type Attempts = { failures: number[]; lockedUntil: number };

export function createLoginThrottle(): LoginThrottle {
  const attempts = new Map<string, Attempts>();
  const keyOf = (email: string) => email.trim().toLowerCase();

  return {
    isLocked(email, now) {
      return now.getTime() < (attempts.get(keyOf(email))?.lockedUntil ?? 0);
    },

    recordFailure(email, now) {
      const key = keyOf(email);
      const time = now.getTime();
      const failures = [...(attempts.get(key)?.failures ?? []).filter((t) => time - t < LOCK_PERIOD_MS), time];
      attempts.set(
        key,
        failures.length >= MAX_FAILED_ATTEMPTS
          ? { failures: [], lockedUntil: time + LOCK_PERIOD_MS }
          : { failures, lockedUntil: 0 },
      );
    },

    reset(email) {
      attempts.delete(keyOf(email));
    },
  };
}
