// API Kontoanlage (F05, UC 1.3.1–1.3.3): prüft die Daten mit den gemeinsamen Regeln,
// stellt die Eindeutigkeit der E-Mail-Adresse sicher, legt den Kunden an und versendet die Bestätigungsmail (F06).

import express, { Router } from 'express';
import { normalizeContact, validateContact, type ContactData } from '@sneakerstudio/shared/contact';
import { validatePassword } from '@sneakerstudio/shared/password';
import { ACTIVATION_PERIOD_MS, createActivationToken } from './activation.ts';
import { buildConfirmationMail } from './confirmation-mail.ts';
import type { CustomerStore } from './customer-store.ts';
import type { Mailer } from './mailer.ts';
import { hashPassword } from './password-hash.ts';

export type RegistrationDeps = {
  customers: CustomerStore;
  mailer: Mailer;
  appBaseUrl: string;
  now: () => Date;
};

function readField(body: unknown, name: string): string {
  const value = typeof body === 'object' && body !== null ? (body as Record<string, unknown>)[name] : undefined;
  return typeof value === 'string' ? value : '';
}

export function createRegistrationRouter({ customers, mailer, appBaseUrl, now }: RegistrationDeps): Router {
  const router = Router();

  router.post('/api/registrations', express.json(), async (req, res) => {
    const field = (name: string) => readField(req.body, name);
    const contact: ContactData = {
      salutation: field('salutation'),
      firstName: field('firstName'),
      lastName: field('lastName'),
      street: field('street'),
      houseNumber: field('houseNumber'),
      postalCode: field('postalCode'),
      city: field('city'),
      email: field('email'),
      phone: field('phone'),
    };
    const password = field('password');

    const errors: Record<string, string> = { ...validateContact(contact) };
    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;
    if (Object.keys(errors).length > 0) {
      res.status(422).json({ errors });
      return;
    }

    const customer = normalizeContact(contact);
    if (await customers.emailExists(customer.email)) {
      res.status(409).json({ errors: { email: 'Diese E-Mail-Adresse ist bereits registriert' } });
      return;
    }

    const { token, tokenHash } = createActivationToken();
    const createdAt = now();
    const id = await customers.create({
      ...customer,
      passwordHash: await hashPassword(password),
      activationTokenHash: tokenHash,
      createdAt,
      activationExpiresAt: new Date(createdAt.getTime() + ACTIVATION_PERIOD_MS),
    });

    try {
      await mailer.send(buildConfirmationMail(customer, { appBaseUrl, token }));
    } catch (error) {
      // Anlage zurücknehmen, damit die E-Mail-Adresse nicht 24 Stunden blockiert bleibt.
      await customers.delete(id);
      throw error;
    }

    res.status(201).json({});
  });

  return router;
}
