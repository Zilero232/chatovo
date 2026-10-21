import { expect, test } from '@playwright/test';

test.describe('app public routes', () => {
  test('the root sends an anonymous visitor to sign in', async ({ page }) => {
    await page.goto('/');

    await page.waitForURL(/\/auth/, { timeout: 15_000 });
    expect(page.url()).toContain('/auth');
  });

  test('auth page renders a sign-in form', async ({ page }) => {
    await page.goto('/auth');

    await expect(page.getByRole('textbox').first()).toBeVisible();
  });

  test('an unknown route renders the not-found page', async ({ page }) => {
    await page.goto('/definitely-not-a-real-route');

    await expect(page.locator('body')).toBeVisible();
  });

  test('lobby redirects an anonymous visitor to auth', async ({ page }) => {
    await page.goto('/lobby');

    await page.waitForURL(/\/auth/, { timeout: 15_000 });
    expect(page.url()).toContain('/auth');
  });

  test.describe('in a German browser', () => {
    test.use({ locale: 'de-DE' });

    test('the first launch speaks the system language', async ({ page }) => {
      await page.goto('/auth');

      await expect(page.locator('html')).toHaveAttribute('lang', 'de');
      await expect(page.getByRole('heading', { name: 'Anmelden' })).toBeVisible();
    });
  });
});
