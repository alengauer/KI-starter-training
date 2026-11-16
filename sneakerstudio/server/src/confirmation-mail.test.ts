import { describe, expect, it } from 'vitest';
import { buildConfirmationMail, type MailRecipient } from './confirmation-mail.ts';

const RECIPIENT: MailRecipient = {
  salutation: 'mr',
  firstName: 'Max',
  lastName: 'Mustermann',
  email: 'max@example.de',
};
const LINK_OPTIONS = { appBaseUrl: 'http://localhost:5173', token: 'abc123' };

describe('F06 Bestätigungsmail (UC 1.3.4)', () => {
  it('geht an die angegebene E-Mail-Adresse', () => {
    const mail = buildConfirmationMail(RECIPIENT, LINK_OPTIONS);

    expect(mail.to).toBe('max@example.de');
    expect(mail.subject).toBe('Bitte bestätige dein SneakerStudio-Kundenkonto');
  });

  it.each([
    ['mr', 'Hallo Herr Mustermann,'],
    ['ms', 'Hallo Frau Mustermann,'],
    ['unspecified', 'Hallo Max Mustermann,'],
  ] as const)('spricht bei Anrede "%s" mit "%s" an (UC 1.1.2.1)', (salutation, greeting) => {
    const mail = buildConfirmationMail({ ...RECIPIENT, salutation }, LINK_OPTIONS);

    expect(mail.text.split('\n')[0]).toBe(greeting);
  });

  it('enthält den 24 Stunden gültigen Bestätigungslink', () => {
    const { text } = buildConfirmationMail(RECIPIENT, LINK_OPTIONS);

    expect(text).toContain('http://localhost:5173/aktivieren?token=abc123');
    expect(text).toContain('24 Stunden gültig');
  });

  it('informiert, dass das Kundenkonto sonst gelöscht wird', () => {
    const { text } = buildConfirmationMail(RECIPIENT, LINK_OPTIONS);

    expect(text).toContain('Wird der Link nicht innerhalb von 24 Stunden angeklickt, wird dein Kundenkonto gelöscht.');
  });
});
