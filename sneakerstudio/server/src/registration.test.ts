import { createHash } from 'node:crypto';
import { once } from 'node:events';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { DatabaseSync } from 'node:sqlite';
import express from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSqliteCustomerStore } from './customer-store.ts';
import type { Mail } from './mailer.ts';
import { createRegistrationRouter } from './registration.ts';

const NOW = new Date('2026-09-25T10:00:00Z');
const ONE_DAY = 24 * 60 * 60 * 1000;
const PASSWORD = 'Sneaker1!';
const PASSWORD_RULE =
  'Das Passwort muss mindestens 8 Zeichen lang sein und mindestens ein Sonderzeichen, einen Großbuchstaben sowie eine Zahl enthalten';
const VALID = {
  salutation: 'mr',
  firstName: 'Max',
  lastName: 'Mustermann',
  street: 'Hauptstraße',
  houseNumber: '12a',
  postalCode: '10115',
  city: 'Berlin',
  email: 'Max@Example.de',
  phone: '+49 151 1234567',
  password: PASSWORD,
};

describe('F05 API Kontoanlage – POST /api/registrations', () => {
  let db: DatabaseSync;
  let server: Server;
  let baseUrl: string;
  const send = vi.fn<(mail: Mail) => Promise<void>>();

  beforeEach(async () => {
    db = new DatabaseSync(':memory:');
    send.mockReset().mockResolvedValue(undefined);
    const router = createRegistrationRouter({
      customers: createSqliteCustomerStore(db),
      mailer: { send },
      appBaseUrl: 'http://localhost:5173',
      now: () => NOW,
    });
    server = express().use(router).listen(0);
    await once(server, 'listening');
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  afterEach(async () => {
    server.close();
    await once(server, 'close');
  });

  const register = (body: unknown) =>
    fetch(`${baseUrl}/api/registrations`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
  const storedCustomers = () => db.prepare('SELECT * FROM customers').all();

  it('legt den Kunden in Speicherform mit Status "nicht aktiviert" an und antwortet mit 201 (UC 1.3.3)', async () => {
    const response = await register(VALID);

    expect(response.status).toBe(201);
    expect(storedCustomers()).toEqual([
      expect.objectContaining({
        salutation: 'mr',
        first_name: 'Max',
        last_name: 'Mustermann',
        street: 'Hauptstraße',
        house_number: '12a',
        postal_code: '10115',
        city: 'Berlin',
        email: 'max@example.de',
        phone: '+491511234567',
        status: 'pending',
        created_at: NOW.getTime(),
        activation_expires_at: NOW.getTime() + ONE_DAY,
      }),
    ]);
  });

  it('speichert das Passwort nur als Hash (UC 1.2.1)', async () => {
    await register(VALID);
    const [customer] = storedCustomers();

    expect(customer?.password_hash).toMatch(/^scrypt\$/);
    expect(JSON.stringify(customer)).not.toContain(PASSWORD);
  });

  it('versendet die Bestätigungsmail; der Token des Links ist nur als Hash gespeichert (UC 1.3.3, UC 1.3.4)', async () => {
    await register(VALID);

    expect(send).toHaveBeenCalledTimes(1);
    const mail = send.mock.calls[0]![0];
    expect(mail.to).toBe('max@example.de');
    const token = new URL(mail.text.match(/http\S+/)![0]).searchParams.get('token')!;
    const [customer] = storedCustomers();
    expect(customer?.activation_token_hash).toBe(createHash('sha256').update(token).digest('hex'));
    expect(JSON.stringify(customer)).not.toContain(token);
  });

  it('lehnt eine bereits registrierte E-Mail-Adresse unabhängig von Groß-/Kleinschreibung mit 409 ab (UC 1.3.2)', async () => {
    await register(VALID);
    const response = await register({ ...VALID, email: 'MAX@example.DE' });

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ errors: { email: 'Diese E-Mail-Adresse ist bereits registriert' } });
    expect(storedCustomers()).toHaveLength(1);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('lehnt ungültige Daten mit 422 und allen Hinweisen ab, ohne etwas anzulegen', async () => {
    const response = await register({});

    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({
      errors: {
        salutation: 'Bitte wähle eine Anrede aus',
        firstName: 'Bitte fülle alle Pflichtfelder aus',
        lastName: 'Bitte fülle alle Pflichtfelder aus',
        street: 'Bitte fülle alle Pflichtfelder aus',
        houseNumber: 'Bitte fülle alle Pflichtfelder aus',
        postalCode: 'Bitte gib Deine korrekte Postleitzahl ein',
        city: 'Bitte fülle alle Pflichtfelder aus',
        email: 'Bitte gib eine gültige E-Mail-Adresse ein',
        password: PASSWORD_RULE,
      },
    });
    expect(storedCustomers()).toHaveLength(0);
    expect(send).not.toHaveBeenCalled();
  });

  it('prüft PLZ und Ort gegen das Verzeichnis (UC 1.1.2.3)', async () => {
    const response = await register({ ...VALID, postalCode: '80331' });

    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({ errors: { postalCode: 'Bitte gib Deine korrekte Postleitzahl ein' } });
  });

  it('lehnt ein schwaches Passwort ab (UC 1.2.1)', async () => {
    const response = await register({ ...VALID, password: 'sneaker' });

    expect(response.status).toBe(422);
    expect(await response.json()).toEqual({ errors: { password: PASSWORD_RULE } });
  });

  it('nimmt die Anlage zurück, wenn der Mailversand scheitert', async () => {
    send.mockRejectedValueOnce(new Error('Postfach nicht erreichbar'));
    const response = await register(VALID);

    expect(response.status).toBe(500);
    expect(storedCustomers()).toHaveLength(0);
  });
});
