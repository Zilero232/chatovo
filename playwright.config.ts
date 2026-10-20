import { defineConfig, devices } from '@playwright/test';

const APP_URL = process.env.E2E_APP_URL ?? 'http://localhost:3000';
const LANDING_URL = process.env.E2E_LANDING_URL ?? 'http://localhost:3001';
const HAS_EXTERNAL_TARGETS = Boolean(process.env.E2E_APP_URL && process.env.E2E_LANDING_URL);

const DESKTOP = { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } };
const MOBILE = devices['Pixel 7'];

export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/.results',

  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
  retries: process.env.CI ? 1 : 0,

  timeout: 90_000,
  expect: { timeout: 15_000 },

  reporter: process.env.CI ? [['github'], ['list']] : [['list']],

  webServer: HAS_EXTERNAL_TARGETS
    ? undefined
    : [
        {
          command: 'bun --filter @chatovo/client-web dev',
          url: APP_URL,
          reuseExistingServer: !process.env.CI,
          timeout: 180_000
        },
        {
          command: 'bun --filter @chatovo/landing dev',
          url: LANDING_URL,
          reuseExistingServer: !process.env.CI,
          timeout: 180_000
        }
      ],

  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off'
  },

  projects: [
    { name: 'app-desktop', testMatch: 'app/**', use: { ...DESKTOP, baseURL: APP_URL } },
    { name: 'app-mobile', testMatch: 'app/**', use: { ...MOBILE, baseURL: APP_URL } },
    { name: 'landing-desktop', testMatch: 'landing/**', use: { ...DESKTOP, baseURL: LANDING_URL } },
    { name: 'landing-mobile', testMatch: 'landing/**', use: { ...MOBILE, baseURL: LANDING_URL } }
  ]
});
