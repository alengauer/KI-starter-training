import { describe, expect, it } from 'vitest';
import { validatePassword, validatePasswordConfirmation } from './password.ts';

describe('F04 Passwort (UC 1.2.1)', () => {
  const RULE =
    'Das Passwort muss mindestens 8 Zeichen lang sein und mindestens ein Sonderzeichen, einen Großbuchstaben sowie eine Zahl enthalten';

  it.each(['Abcdef1!', 'Sneaker2026#', 'Mein Passwort 1!'])('akzeptiert "%s"', (password) => {
    expect(validatePassword(password)).toBeNull();
  });

  it('zählt Ä als Großbuchstaben', () => {
    expect(validatePassword('Äpfelbaum7#')).toBeNull();
  });

  it.each([
    ['', 'leer'],
    ['Abcde1!', 'nur 7 Zeichen'],
    ['Sneakers1', 'ohne Sonderzeichen'],
    ['sneaker1!', 'ohne Großbuchstaben'],
    ['Sneakers!', 'ohne Zahl'],
    ['SNEAKER 1', 'Leerzeichen ist kein Sonderzeichen'],
  ])('lehnt "%s" ab (%s)', (password) => {
    expect(validatePassword(password)).toBe(RULE);
  });
});

describe('F04 Passwort wiederholen (UC 1.2.2)', () => {
  it('akzeptiert eine identische Wiederholung', () => {
    expect(validatePasswordConfirmation('Sneaker1!', 'Sneaker1!')).toBeNull();
  });

  it.each(['', 'Sneaker1?', 'sneaker1!', 'Sneaker1! '])('meldet die abweichende Wiederholung "%s"', (confirmation) => {
    expect(validatePasswordConfirmation('Sneaker1!', confirmation)).toBe('Die Passwörter stimmen nicht überein');
  });
});
