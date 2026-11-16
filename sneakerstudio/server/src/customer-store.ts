// Kundenstamm (F05, UC 1.3.2 und 1.3.3; Anmeldung F08, Kontaktdaten F09): Adapter zum ERP-System.
// Das Interface ist asynchron, damit es später gegen ein echtes ERP getauscht werden kann;
// die Implementierung nutzt SQLite aus Node (node:sqlite).

import { randomUUID } from 'node:crypto';
import type { DatabaseSync } from 'node:sqlite';
import type { NormalizedContact, Salutation } from '@sneakerstudio/shared/contact';

export type NewCustomer = {
  salutation: Salutation;
  firstName: string;
  lastName: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  email: string;
  phone: string | null;
  passwordHash: string;
  activationTokenHash: string;
  createdAt: Date;
  activationExpiresAt: Date;
};

type CustomerStatus = 'pending' | 'active';

export type CustomerActivation = {
  id: string;
  status: CustomerStatus;
  activationExpiresAt: Date;
};

export type CustomerCredentials = {
  id: string;
  status: CustomerStatus;
  passwordHash: string;
};

export interface CustomerStore {
  emailExists(email: string): Promise<boolean>;
  create(customer: NewCustomer): Promise<string>;
  delete(id: string): Promise<void>;
  findByActivationTokenHash(tokenHash: string): Promise<CustomerActivation | null>;
  activate(id: string): Promise<void>;
  deleteExpiredPending(now: Date): Promise<number>;
  findCredentialsByEmail(email: string): Promise<CustomerCredentials | null>;
  findProfile(id: string): Promise<NormalizedContact | null>;
}

export function createSqliteCustomerStore(db: DatabaseSync): CustomerStore {
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      salutation TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      street TEXT NOT NULL,
      house_number TEXT NOT NULL,
      postal_code TEXT NOT NULL,
      city TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      password_hash TEXT NOT NULL,
      status TEXT NOT NULL,
      activation_token_hash TEXT NOT NULL,
      activation_expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS customers_activation_token_hash ON customers (activation_token_hash);
  `);

  const insert = db.prepare(`
    INSERT INTO customers (
      id, salutation, first_name, last_name, street, house_number, postal_code, city, email, phone,
      password_hash, status, activation_token_hash, activation_expires_at, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)
  `);
  const findEmail = db.prepare('SELECT 1 FROM customers WHERE email = ?');
  const remove = db.prepare('DELETE FROM customers WHERE id = ?');
  const findActivation = db.prepare(
    'SELECT id, status, activation_expires_at FROM customers WHERE activation_token_hash = ?',
  );
  const markActive = db.prepare("UPDATE customers SET status = 'active' WHERE id = ?");
  const removeExpiredPending = db.prepare(
    "DELETE FROM customers WHERE status = 'pending' AND activation_expires_at <= ?",
  );
  const findCredentials = db.prepare('SELECT id, status, password_hash FROM customers WHERE email = ?');
  const findContact = db.prepare(
    'SELECT salutation, first_name, last_name, street, house_number, postal_code, city, email, phone FROM customers WHERE id = ?',
  );

  return {
    async emailExists(email) {
      return findEmail.get(email.toLowerCase()) !== undefined;
    },

    async create(customer) {
      const id = randomUUID();
      insert.run(
        id,
        customer.salutation,
        customer.firstName,
        customer.lastName,
        customer.street,
        customer.houseNumber,
        customer.postalCode,
        customer.city,
        customer.email.toLowerCase(),
        customer.phone,
        customer.passwordHash,
        customer.activationTokenHash,
        customer.activationExpiresAt.getTime(),
        customer.createdAt.getTime(),
      );
      return id;
    },

    async delete(id) {
      remove.run(id);
    },

    async findByActivationTokenHash(tokenHash) {
      const row = findActivation.get(tokenHash);
      if (!row) return null;
      return {
        id: String(row.id),
        status: row.status as CustomerStatus,
        activationExpiresAt: new Date(Number(row.activation_expires_at)),
      };
    },

    async activate(id) {
      markActive.run(id);
    },

    async deleteExpiredPending(now) {
      return Number(removeExpiredPending.run(now.getTime()).changes);
    },

    async findCredentialsByEmail(email) {
      const row = findCredentials.get(email.toLowerCase());
      if (!row) return null;
      return { id: String(row.id), status: row.status as CustomerStatus, passwordHash: String(row.password_hash) };
    },

    async findProfile(id) {
      const row = findContact.get(id);
      if (!row) return null;
      return {
        salutation: row.salutation as Salutation,
        firstName: String(row.first_name),
        lastName: String(row.last_name),
        street: String(row.street),
        houseNumber: String(row.house_number),
        postalCode: String(row.postal_code),
        city: String(row.city),
        email: String(row.email),
        phone: row.phone === null ? null : String(row.phone),
      };
    },
  };
}
