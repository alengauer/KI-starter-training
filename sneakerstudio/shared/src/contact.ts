// Regeln für die Kontaktdaten (F03, UC 1.1.2.x).
// Jede Prüfung liefert den Hinweistext aus den Use Cases oder null, wenn die Eingabe gültig ist.
// Die Feldprüfungen prüfen nur das Format; validateContact prüft PLZ und Ort zusätzlich gegen das Verzeichnis.

import { isKnownCity, isKnownPostalCode, postalCodeMatchesCity } from './postal-directory.ts';

export const SALUTATIONS = [
  { value: 'mr', label: 'Herr' },
  { value: 'ms', label: 'Frau' },
  { value: 'unspecified', label: 'Keine Angabe' },
] as const;

export type Salutation = (typeof SALUTATIONS)[number]['value'];

export type ContactData = {
  salutation: string;
  firstName: string;
  lastName: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  email: string;
  phone: string;
};

export type ContactField = keyof ContactData;
export type ContactErrors = Partial<Record<ContactField, string>>;

export type NormalizedContact = Omit<ContactData, 'salutation' | 'phone'> & {
  salutation: Salutation;
  phone: string | null;
};

const REQUIRED = 'Bitte fülle alle Pflichtfelder aus';
const POSTAL_CODE_INVALID = 'Bitte gib Deine korrekte Postleitzahl ein';
const CITY_UNKNOWN = 'Bitte gib einen existierenden Ort in Deutschland ein';

const LETTERS_SPACES_HYPHENS = /^[A-Za-zÄÖÜäöüß -]+$/;
const HOUSE_NUMBER = /^[0-9A-Za-z\/-]+$/;
const POSTAL_CODE = /^[0-9]{5}$/;
const EMAIL =
  /^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;
const GERMAN_PHONE = /^\+49[0-9]{3,15}$/;

function clean(value: string): string {
  return value.normalize('NFC').trim();
}

export function validateSalutation(value: string): string | null {
  return SALUTATIONS.some((s) => s.value === value) ? null : 'Bitte wähle eine Anrede aus';
}

export function validateRequired(value: string): string | null {
  return clean(value) === '' ? REQUIRED : null;
}

export function validateStreet(value: string): string | null {
  const street = clean(value);
  if (street === '') return REQUIRED;
  return LETTERS_SPACES_HYPHENS.test(street)
    ? null
    : 'Die Straße darf nur Buchstaben, Leerzeichen und Bindestriche enthalten';
}

export function validateHouseNumber(value: string): string | null {
  const houseNumber = clean(value);
  if (houseNumber === '') return REQUIRED;
  return HOUSE_NUMBER.test(houseNumber) ? null : 'Die Hausnummer darf nur Ziffern, Buchstaben, / und - enthalten';
}

export function validatePostalCode(value: string): string | null {
  return POSTAL_CODE.test(clean(value)) ? null : POSTAL_CODE_INVALID;
}

export function validateCity(value: string): string | null {
  const city = clean(value);
  if (city === '') return REQUIRED;
  return LETTERS_SPACES_HYPHENS.test(city) ? null : 'Der Ort darf nur Buchstaben, Leerzeichen und Bindestriche enthalten';
}

export function validateEmail(value: string): string | null {
  const email = clean(value);
  const valid = email.length >= 6 && email.length <= 320 && EMAIL.test(email);
  return valid ? null : 'Bitte gib eine gültige E-Mail-Adresse ein';
}

// Standardformat: ohne Leerzeichen, „-“, „/“, Klammern und „(0)“; „0049“ wird zu „+49“.
export function normalizePhone(value: string): string {
  const compact = clean(value).replaceAll('(0)', '').replace(/[\s()\/-]/g, '');
  return compact.startsWith('0049') ? `+49${compact.slice(4)}` : compact;
}

export function validatePhone(value: string): string | null {
  if (clean(value) === '') return null;
  return GERMAN_PHONE.test(normalizePhone(value))
    ? null
    : 'Bitte gib eine gültige Telefonnummer mit der Vorwahl +49 ein';
}

const VALIDATORS: Record<ContactField, (value: string) => string | null> = {
  salutation: validateSalutation,
  firstName: validateRequired,
  lastName: validateRequired,
  street: validateStreet,
  houseNumber: validateHouseNumber,
  postalCode: validatePostalCode,
  city: validateCity,
  email: validateEmail,
  phone: validatePhone,
};

export function validateContact(data: ContactData): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of Object.keys(VALIDATORS) as ContactField[]) {
    const message = VALIDATORS[field](data[field]);
    if (message) errors[field] = message;
  }
  if (!errors.postalCode && !isKnownPostalCode(data.postalCode)) errors.postalCode = POSTAL_CODE_INVALID;
  if (!errors.city && !isKnownCity(data.city)) errors.city = CITY_UNKNOWN;
  if (!errors.postalCode && !errors.city && !postalCodeMatchesCity(data.postalCode, data.city)) {
    errors.postalCode = POSTAL_CODE_INVALID;
  }
  return errors;
}

// Persönliche Anrede für Mail, Header und Willkommensseite (UC 1.1.2.1 „Personalisierung meiner Kommunikation“):
// „Herr Mustermann“ bzw. „Frau Mustermann“, bei „Keine Angabe“ Vor- und Nachname.
export function formatAddressee({
  salutation,
  firstName,
  lastName,
}: Pick<NormalizedContact, 'salutation' | 'firstName' | 'lastName'>): string {
  switch (salutation) {
    case 'mr':
      return `Herr ${lastName}`;
    case 'ms':
      return `Frau ${lastName}`;
    case 'unspecified':
      return `${firstName} ${lastName}`;
  }
}

// Speicherform (F03): getrimmt, Telefon im Standardformat oder null, E-Mail klein geschrieben.
// Nur für Daten aufrufen, für die validateContact keine Hinweise liefert.
export function normalizeContact(data: ContactData): NormalizedContact {
  return {
    salutation: data.salutation as Salutation,
    firstName: clean(data.firstName),
    lastName: clean(data.lastName),
    street: clean(data.street),
    houseNumber: clean(data.houseNumber),
    postalCode: clean(data.postalCode),
    city: clean(data.city),
    email: clean(data.email).toLowerCase(),
    phone: clean(data.phone) === '' ? null : normalizePhone(data.phone),
  };
}
