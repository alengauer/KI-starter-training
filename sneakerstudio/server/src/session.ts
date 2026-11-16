// Anmeldung (F08, UC 1.5.1–1.5.4): POST /api/session meldet an, GET liefert die angemeldete Person,
// DELETE meldet ab. Die Sitzung steckt in einem HttpOnly-Cookie; Hinweistexte aus docs/usecases_entwurf.md.

import { randomBytes } from 'node:crypto';
import express, { Router, type Request } from 'express';
import type { CustomerStore } from './customer-store.ts';
import type { LoginThrottle } from './login-throttle.ts';
import { hashPassword, verifyPassword } from './password-hash.ts';
import { SESSION_DURATION_MS, type SessionStore } from './session-store.ts';

export const SESSION_COOKIE = 'sneakerstudio_session';

export type SessionDeps = {
  customers: CustomerStore;
  sessions: SessionStore;
  loginThrottle: LoginThrottle;
  appBaseUrl: string;
  now: () => Date;
};

// Liest das Sitzungs-Cookie aus dem Cookie-Header – ohne Zusatzpaket.
function readSessionToken(req: Request): string | null {
  for (const part of (req.headers.cookie ?? '').split(';')) {
    const [name, ...value] = part.trim().split('=');
    if (name === SESSION_COOKIE) return value.join('=') || null;
  }
  return null;
}

export function createSessionRouter({ customers, sessions, loginThrottle, appBaseUrl, now }: SessionDeps): Router {
  const router = Router();
  const cookieOptions = { httpOnly: true, sameSite: 'lax', path: '/', secure: appBaseUrl.startsWith('https://') } as const;

  // Vergleichs-Hash für unbekannte E-Mail-Adressen: Die Antwortzeit verrät nicht, ob ein Konto existiert.
  let comparisonHash: Promise<string> | undefined;
  const unknownCustomerHash = () => (comparisonHash ??= hashPassword(randomBytes(16).toString('hex')));

  async function currentCustomer(req: Request) {
    const token = readSessionToken(req);
    const customerId = token ? await sessions.findCustomerId(token, now()) : null;
    return customerId ? customers.findProfile(customerId) : null;
  }

  router.post('/api/session', express.json(), async (req, res) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (loginThrottle.isLocked(email, now())) {
      res.status(429).json({ error: 'Zu viele Anmeldeversuche. Bitte versuche es in 15 Minuten erneut.' });
      return;
    }

    const customer = email ? await customers.findCredentialsByEmail(email) : null;
    const passwordMatches = await verifyPassword(password, customer?.passwordHash ?? (await unknownCustomerHash()));
    if (!customer || !passwordMatches) {
      loginThrottle.recordFailure(email, now());
      res.status(401).json({ error: 'E-Mail-Adresse oder Passwort ist falsch' });
      return;
    }

    loginThrottle.reset(email);
    // Erst nach richtigem Passwort: nur wer das Passwort kennt, erfährt vom nicht aktivierten Konto.
    if (customer.status !== 'active') {
      res.status(403).json({ error: 'Bitte bestätige zuerst deine E-Mail-Adresse über den Link in unserer E-Mail.' });
      return;
    }

    const token = await sessions.create(customer.id, now());
    res.cookie(SESSION_COOKIE, token, { ...cookieOptions, maxAge: SESSION_DURATION_MS });
    res.json({ customer: await customers.findProfile(customer.id) });
  });

  // Ohne gültige Sitzung: 200 mit customer: null – „abgemeldet“ ist ein normaler Zustand, kein Fehler.
  router.get('/api/session', async (req, res) => {
    res.json({ customer: await currentCustomer(req) });
  });

  router.delete('/api/session', async (req, res) => {
    const token = readSessionToken(req);
    if (token) await sessions.delete(token);
    res.clearCookie(SESSION_COOKIE, cookieOptions);
    res.status(204).end();
  });

  return router;
}
