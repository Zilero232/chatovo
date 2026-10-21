import { expect, test } from '@playwright/test';

test.describe('site pages', () => {
  test.describe('in a Russian browser', () => {
    test.use({ locale: 'ru-RU' });

    test('the home page renders in Russian at the bare path', async ({ page }) => {
      const response = await page.goto('/');

      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(/chatovo/i);
      await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
    });
  });

  for (const locale of ['en', 'uk', 'es', 'pt', 'de', 'fr', 'tr', 'pl']) {
    test(`the ${locale} home page lives under /${locale}`, async ({ page }) => {
      const response = await page.goto(`/${locale}`);

      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
    });
  }

  test.describe('in a German browser', () => {
    test.use({ locale: 'de-DE' });

    test('the home page sends a first visit to the browser language', async ({ page }) => {
      await page.goto('/');

      await expect(page).toHaveURL(/\/de$/);
    });
  });

  test('the /ru prefix collapses to the bare path', async ({ page }) => {
    await page.goto('/ru/features');

    expect(new URL(page.url()).pathname).toBe('/features');
  });

  for (const path of ['/features', '/download', '/changelog', '/about', '/support']) {
    test(`${path} renders with a canonical link`, async ({ page }) => {
      const response = await page.goto(path);

      expect(response?.status()).toBe(200);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://chatovo.ru${path}`
      );
    });
  }

  test('privacy policy answers 200, as Google Play requires', async ({ page }) => {
    const response = await page.goto('/privacy');

    expect(response?.status()).toBe(200);
    await expect(page.locator('body')).toContainText(/privacy|конфиденциальност/i);
  });

  test('terms answer 200', async ({ page }) => {
    const response = await page.goto('/terms');

    expect(response?.status()).toBe(200);
    await expect(page.locator('body')).toContainText(/terms|условия/i);
  });

  test('an unknown page answers 404 with the site shell', async ({ page }) => {
    const response = await page.goto('/definitely-not-a-real-page');

    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});

test.describe('site files', () => {
  for (const path of ['/sitemap.xml', '/robots.txt', '/llms.txt', '/opengraph-image']) {
    test(`${path} is served`, async ({ request }) => {
      const response = await request.get(path);

      expect(response.status()).toBe(200);
    });
  }
});
