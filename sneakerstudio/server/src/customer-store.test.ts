import { DatabaseSync } from 'node:sqlite';
import { beforeEach, describe, expect, it } from 'vitest';
import { createSqliteCustomerStore, type CustomerStore, type NewCustomer } from './customer-store.ts';

const NOW = new Date('2026-09-25T10:00:00Z');
const ONE_DAY = 24 * 60 * 60 * 1000;

function newCustomer(overrides: Partial<NewCustomer> = {}): NewCustomer {
  return {
    salutation: 'ms',
    firstName: 'Erika',
    lastName: 'Mustermann',
    street: 'Hauptstraße',
    houseNumber: '12a',
    postalCode: '10115',
    city: 'Berlin',
    email: 'erika@example.de',
    phone: null,
    passwordHash: 'scrypt$salt$hash',
    activationTokenHash: 'token-hash',
    createdAt: NOW,
    activationExpiresAt: new Date(NOW.getTime() + ONE_DAY),
    ...overrides,
  };
}

describe('F05 Kundenstamm (UC 1.3.2, UC 1.3.3)', () => {
  let db: DatabaseSync;
  let store: CustomerStore;

  beforeEach(() => {
    db = new DatabaseSync(':memory:');
    store = createSqliteCustomerStore(db);
  });

  it('legt einen Kunden mit Status "nicht aktiviert" an', async () => {
    const id = await store.create(newCustomer());

    expect(db.prepare('SELECT * FROM customers WHERE id = ?').get(id)).toMatchObject({
      salutation: 'ms',
      first_name: 'Erika',
      last_name: 'Mustermann',
      street: 'Hauptstraße',
      house_number: '12a',
      postal_code: '10115',
      city: 'Berlin',
      email: 'erika@example.de',
      phone: null,
      password_hash: 'scrypt$salt$hash',
      status: 'pending',
      activation_token_hash: 'token-hash',
      activation_expires_at: NOW.getTime() + ONE_DAY,
      created_at: NOW.getTime(),
    });
  });

  it('speichert die E-Mail-Adresse klein geschrieben', async () => {
    const id = await store.create(newCustomer({ email: 'Erika@Example.DE' }));

    expect(db.prepare('SELECT email FROM customers WHERE id = ?').get(id)).toEqual({ email: 'erika@example.de' });
  });

  it('erkennt eine vorhandene E-Mail-Adresse unabhängig von Groß-/Kleinschreibung', async () => {
    await store.create(newCustomer());

    expect(await store.emailExists('ERIKA@example.de')).toBe(true);
    expect(await store.emailExists('max@example.de')).toBe(false);
  });

  it('lässt keine zweite Anlage mit derselben E-Mail-Adresse zu', async () => {
    await store.create(newCustomer());

    await expect(
      store.create(newCustomer({ email: 'ERIKA@example.de', activationTokenHash: 'other-token-hash' })),
    ).rejects.toThrow(/customers\.email/);
  });

  it('löscht einen Kunden', async () => {
    const id = await store.create(newCustomer());
    await store.delete(id);

    expect(await store.emailExists('erika@example.de')).toBe(false);
  });

  it('behält vorhandene Kunden, wenn die Datenbank erneut geöffnet wird', async () => {
    await store.create(newCustomer());
    const reopened = createSqliteCustomerStore(db);

    expect(await reopened.emailExists('erika@example.de')).toBe(true);
  });

  it('findet einen Kunden über den Hash des Aktivierungs-Tokens (F06)', async () => {
    const id = await store.create(newCustomer());

    expect(await store.findByActivationTokenHash('token-hash')).toEqual({
      id,
      status: 'pending',
      activationExpiresAt: new Date(NOW.getTime() + ONE_DAY),
    });
    expect(await store.findByActivationTokenHash('unbekannt')).toBeNull();
  });

  it('aktiviert einen Kunden (F06)', async () => {
    const id = await store.create(newCustomer());
    await store.activate(id);

    expect(await store.findByActivationTokenHash('token-hash')).toMatchObject({ status: 'active' });
  });

  it('liefert die Anmeldedaten zu einer E-Mail-Adresse, unabhängig von Groß-/Kleinschreibung (F08)', async () => {
    const id = await store.create(newCustomer());
    await store.activate(id);

    expect(await store.findCredentialsByEmail('ERIKA@example.de')).toEqual({
      id,
      status: 'active',
      passwordHash: 'scrypt$salt$hash',
    });
    expect(await store.findCredentialsByEmail('max@example.de')).toBeNull();
  });

  it('liefert die Kontaktdaten eines Kunden ohne Passwort (F09)', async () => {
    const id = await store.create(newCustomer({ phone: '+491511234567' }));

    expect(await store.findProfile(id)).toEqual({
      salutation: 'ms',
      firstName: 'Erika',
      lastName: 'Mustermann',
      street: 'Hauptstraße',
      houseNumber: '12a',
      postalCode: '10115',
      city: 'Berlin',
      email: 'erika@example.de',
      phone: '+491511234567',
    });
    expect(await store.findProfile('unbekannt')).toBeNull();
  });

  it('löscht nur nicht aktivierte Konten, deren Link abgelaufen ist (F06)', async () => {
    const expiresIn = (offset: number) => new Date(NOW.getTime() + offset);
    const create = (email: string, activationTokenHash: string, offset: number) =>
      store.create(newCustomer({ email, activationTokenHash, activationExpiresAt: expiresIn(offset) }));
    await create('abgelaufen@example.de', 'a', -1);
    await create('grenze@example.de', 'b', 0);
    await create('gueltig@example.de', 'c', 1);
    await store.activate(await create('aktiv@example.de', 'd', -1));

    expect(await store.deleteExpiredPending(NOW)).toBe(2);
    expect(await store.emailExists('abgelaufen@example.de')).toBe(false);
    expect(await store.emailExists('grenze@example.de')).toBe(false);
    expect(await store.emailExists('gueltig@example.de')).toBe(true);
    expect(await store.emailExists('aktiv@example.de')).toBe(true);
  });
});
