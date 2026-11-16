// Passwortregeln (F04, UC 1.2.1 und 1.2.2).
// Passwörter werden weder getrimmt noch verändert – jedes Zeichen zählt.

const PASSWORD_RULE =
  'Das Passwort muss mindestens 8 Zeichen lang sein und mindestens ein Sonderzeichen, einen Großbuchstaben sowie eine Zahl enthalten';

// Sonderzeichen = weder Buchstabe noch Ziffer noch Leerzeichen.
const SPECIAL_CHARACTER = /[^\p{L}\p{N}\s]/u;
const UPPERCASE_LETTER = /\p{Lu}/u;
const DIGIT = /[0-9]/;

export function validatePassword(password: string): string | null {
  const valid =
    [...password].length >= 8 &&
    SPECIAL_CHARACTER.test(password) &&
    UPPERCASE_LETTER.test(password) &&
    DIGIT.test(password);
  return valid ? null : PASSWORD_RULE;
}

export function validatePasswordConfirmation(password: string, confirmation: string): string | null {
  return password === confirmation ? null : 'Die Passwörter stimmen nicht überein';
}
