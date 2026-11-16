// Kontoaktivierung (F06, Fachkonzept 1.3, UC 1.3.4): Der Aktivierungslink ist 24 Stunden gültig.
// Aktivierung per POST /api/activations; nicht aktivierte Konten werden nach Ablauf gelöscht.

import { createHash, randomBytes } from 'node:crypto';
import express, { Router } from 'express';
import type { CustomerStore } from './customer-store.ts';

export const ACTIVATION_PERIOD_MS = 24 * 60 * 60 * 1000;
const CLEANUP_INTERVAL_MS = 15 * 60 * 1000;

function hashActivationToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

// Der Token steht nur im Link der Bestätigungsmail; gespeichert wird ausschließlich sein Hash.
export function createActivationToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString('base64url');
  return { token, tokenHash: hashActivationToken(token) };
}

export function createActivationRouter({ customers, now }: { customers: CustomerStore; now: () => Date }): Router {
  const router = Router();

  router.post('/api/activations', express.json(), async (req, res) => {
    const token: unknown = req.body?.token;
    const customer =
      typeof token === 'string' && token !== ''
        ? await customers.findByActivationTokenHash(hashActivationToken(token))
        : null;

    if (!customer) {
      res.status(404).json({});
    } else if (customer.status === 'active') {
      res.status(200).json({});
    } else if (now().getTime() >= customer.activationExpiresAt.getTime()) {
      await customers.delete(customer.id);
      res.status(410).json({});
    } else {
      await customers.activate(customer.id);
      res.status(200).json({});
    }
  });

  return router;
}

export function startExpiredAccountCleanup(
  customers: Pick<CustomerStore, 'deleteExpiredPending'>,
  now: () => Date,
  log: (message: string, error: unknown) => void = console.error,
): () => void {
  const timer = setInterval(() => {
    customers
      .deleteExpiredPending(now())
      .catch((error: unknown) => log('Aufräumen nicht aktivierter Konten fehlgeschlagen', error));
  }, CLEANUP_INTERVAL_MS);
  timer.unref();
  return () => clearInterval(timer);
}
