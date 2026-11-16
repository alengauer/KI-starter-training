import { describe, expect, it } from 'vitest';
import { validateCity, validatePostalCode } from './contact.ts';
import { POSTAL_DIRECTORY, isKnownCity, isKnownPostalCode, postalCodeMatchesCity } from './postal-directory.ts';

describe('F03 PLZ-Verzeichnis (UC 1.1.2.3, UC 1.1.2.4)', () => {
  it('enthält nur Einträge, die den Eingaberegeln für PLZ und Ort entsprechen', () => {
    for (const [postalCode, city] of POSTAL_DIRECTORY) {
      expect(validatePostalCode(postalCode)).toBeNull();
      expect(validateCity(city)).toBeNull();
    }
  });

  it.each(['10115', '04109', ' 96444 '])('kennt die PLZ "%s"', (postalCode) => {
    expect(isKnownPostalCode(postalCode)).toBe(true);
  });

  it.each(['12345', '00000'])('kennt die PLZ "%s" nicht', (postalCode) => {
    expect(isKnownPostalCode(postalCode)).toBe(false);
  });

  it.each(['Berlin', 'berlin', ' Frankfurt  am Main ', 'Gießen', 'Castrop-Rauxel', 'Überlingen'])(
    'kennt den Ort "%s"',
    (city) => {
      expect(isKnownCity(city)).toBe(true);
    },
  );

  it('kennt einen erfundenen Ort nicht', () => {
    expect(isKnownCity('Musterstadt')).toBe(false);
  });

  it.each([
    ['10115', 'Berlin'],
    ['10117', 'BERLIN'],
    ['96444', 'Coburg'],
    ['96450', 'Coburg'],
  ])('PLZ %s passt zu %s', (postalCode, city) => {
    expect(postalCodeMatchesCity(postalCode, city)).toBe(true);
  });

  it.each([
    ['80331', 'Berlin'],
    ['12345', 'Berlin'],
  ])('PLZ %s passt nicht zu %s', (postalCode, city) => {
    expect(postalCodeMatchesCity(postalCode, city)).toBe(false);
  });
});
