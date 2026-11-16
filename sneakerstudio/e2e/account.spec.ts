import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { expect, test, type Page } from '@playwright/test';

const OUTBOX_DIR = join(process.env.E2E_DATA_DIR ?? '', 'outbox');

async function register(page: Page, email: string) {
  await page.goto('/');
  await page.getByRole('link', { name: 'Neues Kundenkonto erstellen' }).click();
  await page.getByLabel('Anrede').selectOption({ label: 'Herr' });
  await page.getByLabel('Vorname').fill('Max');
  await page.getByLabel('Nachname').fill('Mustermann');
  await page.getByLabel('Straße').fill('Bahnhofsplatz');
  await page.getByLabel('Hausnummer').fill('1');
  await page.getByLabel('PLZ').fill('96444');
  await page.getByLabel('Ort', { exact: true }).fill('Coburg');
  await page.getByLabel('E-Mail-Adresse').fill(email);
  await page.getByLabel('Passwort', { exact: true }).fill('Sneaker1!');
  await page.getByLabel('Passwort wiederholen').fill('Sneaker1!');
  await page.getByRole('button', { name: 'Konto anlegen' }).click();
}

// Liest die Bestätigungsmail aus dem Datei-Postfach des Test-Servers.
async function confirmationMailTo(email: string): Promise<{ subject: string; text: string }> {
  for (const file of await readdir(OUTBOX_DIR)) {
    const mail = JSON.parse(await readFile(join(OUTBOX_DIR, file), 'utf8'));
    if (mail.to === email) return mail;
  }
  throw new Error(`Keine Mail an ${email} im Postfach`);
}

test.describe('F05 Kontoanlage, F06 Kontoaktivierung, F08 Anmeldung, F09 Willkommensseite', () => {
  test('Registrierung → Mail → Aktivierung → Anmeldung → Willkommensseite → Abmelden (UC 1.3, 1.5, 1.6)', async ({
    page,
  }) => {
    await register(page, 'max.aktivierung@example.de');

    await expect(page.getByText('Deine Kontaktdaten wurden erfolgreich verifiziert.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Bitte bestätige deine E-Mail-Adresse' })).toBeVisible();

    const mail = await confirmationMailTo('max.aktivierung@example.de');
    expect(mail.subject).toBe('Bitte bestätige dein SneakerStudio-Kundenkonto');
    expect(mail.text).toContain('Hallo Herr Mustermann,');
    expect(mail.text).toContain('wird dein Kundenkonto gelöscht');
    const link = mail.text.match(/http:\/\/localhost:5173\/aktivieren\?token=\S+/)?.[0];
    expect(link).toBeDefined();

    await page.goto(link ?? '');
    await expect(page.getByRole('heading', { name: 'Konto erfolgreich aktiviert!' })).toBeVisible();
    await page.getByRole('link', { name: 'Jetzt anmelden' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Anmelden' })).toBeVisible();

    await page.getByLabel('E-Mail-Adresse').fill('max.aktivierung@example.de');
    await page.getByLabel('Passwort').fill('Sneaker1!');
    await page.getByRole('button', { name: 'Anmelden' }).click();

    await expect(page.getByRole('heading', { level: 1, name: 'Willkommen, Herr Mustermann!' })).toBeVisible();
    await expect(page.getByText('96444 Coburg')).toBeVisible();
    await expect(page.getByRole('banner').getByText('Herr Mustermann')).toBeVisible();

    // Landing Page für Angemeldete: „Zu meinem Konto“ statt der Einstiege (UC 1.4.1)
    await page.getByRole('link', { name: 'SneakerStudio' }).click();
    await expect(page.getByRole('main').getByRole('link', { name: 'Anmelden' })).toHaveCount(0);
    await page.getByRole('link', { name: 'Zu meinem Konto' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Willkommen, Herr Mustermann!' })).toBeVisible();

    await page.getByRole('button', { name: 'Abmelden' }).click();
    await expect(page.getByRole('heading', { name: 'Dein Sneaker. Dein Style.' })).toBeVisible();
    await expect(page.getByRole('banner').getByRole('link', { name: 'Anmelden' })).toBeVisible();
  });

  test('die Landing Page führt über „Anmelden“ zur Anmeldung (UC 1.4.1)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('main').getByRole('link', { name: 'Anmelden' }).click();

    await expect(page.getByRole('heading', { level: 1, name: 'Anmelden' })).toBeVisible();
  });

  test('die Willkommensseite leitet ohne Anmeldung zur Anmeldeseite (UC 1.6.3)', async ({ page }) => {
    await page.goto('/willkommen');

    await expect(page).toHaveURL(/\/anmelden$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Anmelden' })).toBeVisible();
  });

  test('falsche Anmeldedaten zeigen den Hinweis (UC 1.5.1)', async ({ page }) => {
    await page.goto('/anmelden');
    await page.getByLabel('E-Mail-Adresse').fill('niemand@example.de');
    await page.getByLabel('Passwort').fill('Falsch123!');
    await page.getByRole('button', { name: 'Anmelden' }).click();

    await expect(page.getByRole('alert')).toHaveText('E-Mail-Adresse oder Passwort ist falsch');
  });

  test('eine zweite Registrierung mit derselben E-Mail-Adresse zeigt den Hinweis (UC 1.3.2)', async ({ page }) => {
    await register(page, 'max.dublette@example.de');
    await expect(page.getByText('Deine Kontaktdaten wurden erfolgreich verifiziert.')).toBeVisible();

    await register(page, 'MAX.DUBLETTE@example.de');

    await expect(page.getByText('Diese E-Mail-Adresse ist bereits registriert')).toBeVisible();
  });

  test('ein unbekannter Link wird als ungültig gemeldet', async ({ page }) => {
    await page.goto('/aktivieren?token=unbekannt');

    await expect(page.getByRole('heading', { name: 'Dieser Bestätigungslink ist ungültig.' })).toBeVisible();
  });
});
