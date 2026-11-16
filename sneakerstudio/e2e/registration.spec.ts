import { expect, test, type Page } from '@playwright/test';

async function enterContact(page: Page) {
  await page.getByLabel('Anrede').selectOption({ label: 'Frau' });
  await page.getByLabel('Vorname').fill('Erika');
  await page.getByLabel('Nachname').fill('Mustermann');
  await page.getByLabel('Straße').fill('Hauptstraße');
  await page.getByLabel('Hausnummer').fill('12a');
  await page.getByLabel('PLZ').fill('96444');
  await page.getByLabel('Ort', { exact: true }).fill('Coburg');
  await page.getByLabel('E-Mail-Adresse').fill('erika@example.de');
}

async function enterPassword(page: Page) {
  await page.getByLabel('Passwort', { exact: true }).fill('Sneaker1!');
  await page.getByLabel('Passwort wiederholen').fill('Sneaker1!');
}

test.describe('F02 Startseite (UC 1.1.1)', () => {
  test('ein Klick auf "Neues Kundenkonto erstellen" zeigt das Formular zur Eingabe der Kontaktdaten', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Neues Kundenkonto erstellen' }).click();

    await expect(page).toHaveURL(/\/registrieren$/);
    await expect(page.getByRole('heading', { name: 'Konto erstellen' })).toBeVisible();
    await expect(page.getByLabel('Vorname')).toBeVisible();
  });
});

test.describe('F03 Kontaktdaten erfassen (UC 1.1.2) und F04 Passwort festlegen (UC 1.2)', () => {
  test('erst gültige Kontaktdaten und ein bestätigtes Passwort aktivieren "Konto anlegen"', async ({ page }) => {
    await page.goto('/registrieren');
    const submit = page.getByRole('button', { name: 'Konto anlegen' });

    await enterContact(page);
    await expect(submit).toBeDisabled();

    await enterPassword(page);
    await expect(submit).toBeEnabled();
  });

  test('zeigt beim Verlassen einen Hinweis, wenn PLZ und Ort nicht zusammenpassen', async ({ page }) => {
    await page.goto('/registrieren');
    await page.getByLabel('PLZ').fill('80331');
    await page.getByLabel('Ort', { exact: true }).fill('Berlin');
    await page.getByLabel('Ort', { exact: true }).blur();

    await expect(page.getByText('Bitte gib Deine korrekte Postleitzahl ein')).toBeVisible();
  });
});
