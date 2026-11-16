import { describe, expect, it } from 'vitest';
import {
  SALUTATIONS,
  formatAddressee,
  normalizeContact,
  normalizePhone,
  validateCity,
  validateContact,
  validateEmail,
  validateHouseNumber,
  validatePhone,
  validatePostalCode,
  validateRequired,
  validateSalutation,
  validateStreet,
  type ContactData,
} from './contact.ts';

const REQUIRED = 'Bitte fülle alle Pflichtfelder aus';

describe('F03 Anrede (UC 1.1.2.1)', () => {
  it('bietet genau Herr, Frau und Keine Angabe an', () => {
    expect(SALUTATIONS.map((s) => s.label)).toEqual(['Herr', 'Frau', 'Keine Angabe']);
  });

  it('akzeptiert jede vorgegebene Anrede', () => {
    for (const { value } of SALUTATIONS) expect(validateSalutation(value)).toBeNull();
  });

  it.each(['', 'mrs', 'divers'])('lehnt "%s" mit Hinweis ab', (value) => {
    expect(validateSalutation(value)).toBe('Bitte wähle eine Anrede aus');
  });
});

describe('F03 Vorname und Nachname (Fachkonzept 1.1)', () => {
  it.each(['Max', 'José', "O'Brien", 'Anna-Lena'])('akzeptiert "%s"', (value) => {
    expect(validateRequired(value)).toBeNull();
  });

  it.each(['', '   '])('meldet ein leeres Feld ("%s")', (value) => {
    expect(validateRequired(value)).toBe(REQUIRED);
  });
});

describe('F03 Straße (UC 1.1.2.2)', () => {
  it.each(['Hauptstraße', 'Am Weiher', 'Karl-Marx-Allee', 'Äußere Ringstraße', ' Große Bleichen '])(
    'akzeptiert "%s"',
    (value) => {
      expect(validateStreet(value)).toBeNull();
    },
  );

  it('akzeptiert Umlaute auch in zerlegter Unicode-Form', () => {
    expect(validateStreet('Mühlweg')).toBeNull();
  });

  it.each(['', '  '])('meldet ein leeres Feld ("%s")', (value) => {
    expect(validateStreet(value)).toBe(REQUIRED);
  });

  it.each(['Hauptstr.', 'Straße des 17. Juni', "Rue d'Or", 'Weg_1'])('lehnt "%s" wegen unerlaubter Zeichen ab', (value) => {
    expect(validateStreet(value)).toBe('Die Straße darf nur Buchstaben, Leerzeichen und Bindestriche enthalten');
  });
});

describe('F03 Hausnummer (UC 1.1.2.2)', () => {
  it.each(['12', '12a', '12A', '12/1', '12-14', '7b/2'])('akzeptiert "%s"', (value) => {
    expect(validateHouseNumber(value)).toBeNull();
  });

  it('meldet ein leeres Feld', () => {
    expect(validateHouseNumber(' ')).toBe(REQUIRED);
  });

  it.each(['12 a', '12.5', '#3', '12,5'])('lehnt "%s" wegen unerlaubter Zeichen ab', (value) => {
    expect(validateHouseNumber(value)).toBe('Die Hausnummer darf nur Ziffern, Buchstaben, / und - enthalten');
  });
});

describe('F03 Postleitzahl – Format (UC 1.1.2.3)', () => {
  it.each(['10115', '04109', ' 80331 '])('akzeptiert "%s"', (value) => {
    expect(validatePostalCode(value)).toBeNull();
  });

  it.each(['', '1011', '101150', '1011a', '10 115'])('lehnt "%s" mit Hinweis ab', (value) => {
    expect(validatePostalCode(value)).toBe('Bitte gib Deine korrekte Postleitzahl ein');
  });
});

describe('F03 Ort – Zeichen (UC 1.1.2.4)', () => {
  it.each(['Berlin', 'Frankfurt am Main', 'Castrop-Rauxel', 'Gießen', 'Überlingen'])('akzeptiert "%s"', (value) => {
    expect(validateCity(value)).toBeNull();
  });

  it('meldet ein leeres Feld', () => {
    expect(validateCity('')).toBe(REQUIRED);
  });

  it.each(['Halle (Saale)', 'St. Ingbert', 'Köln 1'])('lehnt "%s" wegen unerlaubter Zeichen ab', (value) => {
    expect(validateCity(value)).toBe('Der Ort darf nur Buchstaben, Leerzeichen und Bindestriche enthalten');
  });
});

describe('F03 E-Mail-Adresse (UC 1.1.2.5)', () => {
  const MESSAGE = 'Bitte gib eine gültige E-Mail-Adresse ein';
  const withLength = (length: number) => `${'a'.repeat(length - '@domain.de'.length)}@domain.de`;

  it.each(['name@domain.de', 'a@b.fr', 'Max.Mustermann+shop@mail.example.com', ' max@domain.de '])(
    'akzeptiert "%s"',
    (value) => {
      expect(validateEmail(value)).toBeNull();
    },
  );

  it('akzeptiert genau 320 Zeichen und lehnt 321 Zeichen ab', () => {
    expect(validateEmail(withLength(320))).toBeNull();
    expect(validateEmail(withLength(321))).toBe(MESSAGE);
  });

  it.each([
    '',
    'a@b.c',
    'max@domain',
    'max@domain.123',
    'maxdomain.de',
    'max@@domain.de',
    '@domain.de',
    'max@.de',
    'max@domain..de',
    'max@-domain.de',
    'max mustermann@domain.de',
  ])('lehnt "%s" mit Hinweis ab', (value) => {
    expect(validateEmail(value)).toBe(MESSAGE);
  });
});

describe('F03 Telefonnummer (UC 1.1.2.6)', () => {
  const MESSAGE = 'Bitte gib eine gültige Telefonnummer mit der Vorwahl +49 ein';

  it.each(['', '   '])('erlaubt ein leeres Feld ("%s")', (value) => {
    expect(validatePhone(value)).toBeNull();
  });

  it('akzeptiert 3 und 15 Ziffern nach +49', () => {
    expect(validatePhone('+49123')).toBeNull();
    expect(validatePhone(`+49${'1'.repeat(15)}`)).toBeNull();
  });

  it('lehnt 2 und 16 Ziffern nach +49 ab', () => {
    expect(validatePhone('+4912')).toBe(MESSAGE);
    expect(validatePhone(`+49${'1'.repeat(16)}`)).toBe(MESSAGE);
  });

  it.each(['0151 1234567', '+43 660 1234567', '+49 151 12a3456', '49 151 1234567'])(
    'lehnt "%s" mit Hinweis ab',
    (value) => {
      expect(validatePhone(value)).toBe(MESSAGE);
    },
  );

  it.each([
    ['+49 (0)151 123-456', '+49151123456'],
    ['0049 151 1234567', '+491511234567'],
    ['+49 151/123 456', '+49151123456'],
  ])('wandelt "%s" in das Standardformat "%s" um', (input, expected) => {
    expect(normalizePhone(input)).toBe(expected);
    expect(validatePhone(input)).toBeNull();
  });
});

describe('F03 Kontaktdaten gesamt', () => {
  const valid: ContactData = {
    salutation: 'ms',
    firstName: 'Erika',
    lastName: 'Mustermann',
    street: 'Hauptstraße',
    houseNumber: '12a',
    postalCode: '10115',
    city: 'Berlin',
    email: 'erika@example.de',
    phone: '',
  };

  it('meldet keine Hinweise für gültige Daten', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('meldet für ein leeres Formular jedes Pflichtfeld, aber nicht das Telefon', () => {
    const empty = Object.fromEntries(Object.keys(valid).map((field) => [field, ''])) as ContactData;

    expect(validateContact(empty)).toEqual({
      salutation: 'Bitte wähle eine Anrede aus',
      firstName: REQUIRED,
      lastName: REQUIRED,
      street: REQUIRED,
      houseNumber: REQUIRED,
      postalCode: 'Bitte gib Deine korrekte Postleitzahl ein',
      city: REQUIRED,
      email: 'Bitte gib eine gültige E-Mail-Adresse ein',
    });
  });

  it('meldet nur die ungültigen Felder', () => {
    expect(validateContact({ ...valid, houseNumber: '12 a', phone: '0151' })).toEqual({
      houseNumber: 'Die Hausnummer darf nur Ziffern, Buchstaben, / und - enthalten',
      phone: 'Bitte gib eine gültige Telefonnummer mit der Vorwahl +49 ein',
    });
  });

  describe('PLZ und Ort im Verzeichnis (UC 1.1.2.3, UC 1.1.2.4)', () => {
    const POSTAL_CODE = 'Bitte gib Deine korrekte Postleitzahl ein';
    const CITY_UNKNOWN = 'Bitte gib einen existierenden Ort in Deutschland ein';
    const withLocality = (postalCode: string, city: string) => validateContact({ ...valid, postalCode, city });

    it('akzeptiert eine passende Kombination unabhängig von Groß-/Kleinschreibung', () => {
      expect(withLocality('10115', 'BERLIN')).toEqual({});
    });

    it('meldet eine unbekannte PLZ', () => {
      expect(withLocality('12345', 'Berlin')).toEqual({ postalCode: POSTAL_CODE });
    });

    it('meldet einen unbekannten Ort', () => {
      expect(withLocality('10115', 'Musterstadt')).toEqual({ city: CITY_UNKNOWN });
    });

    it('meldet unbekannte PLZ und unbekannten Ort gemeinsam', () => {
      expect(withLocality('12345', 'Musterstadt')).toEqual({ postalCode: POSTAL_CODE, city: CITY_UNKNOWN });
    });

    it('meldet an der PLZ, wenn PLZ und Ort nicht zusammenpassen', () => {
      expect(withLocality('80331', 'Berlin')).toEqual({ postalCode: POSTAL_CODE });
    });

    it('prüft das Verzeichnis nur bei gültigem Format', () => {
      expect(withLocality('1011', 'Halle (Saale)')).toEqual({
        postalCode: POSTAL_CODE,
        city: 'Der Ort darf nur Buchstaben, Leerzeichen und Bindestriche enthalten',
      });
    });
  });
});

describe('F03 Speicherform der Kontaktdaten', () => {
  const input: ContactData = {
    salutation: 'mr',
    firstName: ' Max ',
    lastName: ' Mustermann ',
    street: ' Mühlweg ',
    houseNumber: ' 12a ',
    postalCode: ' 10115 ',
    city: ' Berlin ',
    email: ' Max@Example.DE ',
    phone: ' +49 (0)151 123-456 ',
  };

  it('entfernt Leerzeichen, bringt die Telefonnummer ins Standardformat und schreibt die E-Mail klein', () => {
    expect(normalizeContact(input)).toEqual({
      salutation: 'mr',
      firstName: 'Max',
      lastName: 'Mustermann',
      street: 'Mühlweg',
      houseNumber: '12a',
      postalCode: '10115',
      city: 'Berlin',
      email: 'max@example.de',
      phone: '+49151123456',
    });
  });

  it('speichert ein leeres Telefonfeld als null', () => {
    expect(normalizeContact({ ...input, phone: '  ' }).phone).toBeNull();
  });
});

describe('F09 Persönliche Anrede (UC 1.1.2.1)', () => {
  it.each([
    ['mr', 'Herr Mustermann'],
    ['ms', 'Frau Mustermann'],
    ['unspecified', 'Max Mustermann'],
  ] as const)('spricht bei Anrede "%s" mit "%s" an', (salutation, expected) => {
    expect(formatAddressee({ salutation, firstName: 'Max', lastName: 'Mustermann' })).toBe(expected);
  });
});
