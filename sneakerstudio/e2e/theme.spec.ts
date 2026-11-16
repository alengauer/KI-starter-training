import { expect, test } from '@playwright/test';

const LIGHT_BG = 'rgb(241, 242, 246)'; // bg hell  #f1f2f6
const DARK_BG = 'rgb(2, 7, 22)'; // bg dunkel #020716

test.describe('F01 Theme', () => {
  test('folgt der Systemeinstellung "hell"', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    await expect(page.locator('body')).toHaveCSS('background-color', LIGHT_BG);
  });

  test('folgt der Systemeinstellung "dunkel"', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');

    await expect(page.locator('body')).toHaveCSS('background-color', DARK_BG);
  });

  test('Umschalten wirkt sofort und bleibt nach dem Neuladen erhalten', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    await page.getByRole('button', { name: 'Zum dunklen Design wechseln' }).click();
    await expect(page.locator('body')).toHaveCSS('background-color', DARK_BG);

    await page.reload();
    await expect(page.locator('body')).toHaveCSS('background-color', DARK_BG);
    await expect(page.getByRole('button', { name: 'Zum hellen Design wechseln' })).toBeVisible();
  });
});
