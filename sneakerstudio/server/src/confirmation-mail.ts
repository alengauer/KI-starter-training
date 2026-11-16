// Bestätigungsmail zum Kundenkonto (F06, UC 1.3.4) mit persönlicher Anrede (UC 1.1.2.1).

import { formatAddressee, type Salutation } from '@sneakerstudio/shared/contact';
import type { Mail } from './mailer.ts';

export type MailRecipient = {
  salutation: Salutation;
  firstName: string;
  lastName: string;
  email: string;
};

export function buildConfirmationMail(
  recipient: MailRecipient,
  { appBaseUrl, token }: { appBaseUrl: string; token: string },
): Mail {
  const link = new URL('/aktivieren', appBaseUrl);
  link.searchParams.set('token', token);

  return {
    to: recipient.email,
    subject: 'Bitte bestätige dein SneakerStudio-Kundenkonto',
    text: [
      `Hallo ${formatAddressee(recipient)},`,
      '',
      'vielen Dank für deine Registrierung bei SneakerStudio.',
      'Bitte bestätige deine E-Mail-Adresse über diesen Link – er ist 24 Stunden gültig:',
      '',
      link.href,
      '',
      'Wird der Link nicht innerhalb von 24 Stunden angeklickt, wird dein Kundenkonto gelöscht.',
      '',
      'Dein SneakerStudio-Team',
    ].join('\n'),
  };
}
