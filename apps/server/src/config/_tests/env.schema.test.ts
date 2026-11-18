import { describe, expect, it } from 'vitest';

import { validateEnv } from '../env.schema';

const BASE = {
  DATABASE_URL: 'postgresql://test:test@localhost:5433/test',
  BETTER_AUTH_SECRET: 'secret',
  BETTER_AUTH_URL: 'http://localhost:4000',
  SMTP_HOST: 'localhost',
  SMTP_USER: 'test',
  SMTP_PASSWORD: 'test',
  EMAIL_FROM: 'test@chatovo.invalid',
  SUPPORT_EMAIL: 'test@chatovo.invalid',
  LIVEKIT_API_KEY: 'devkey',
  LIVEKIT_API_SECRET: 'devsecret_devsecret_devsecret_32',
  LIVEKIT_URL: 'ws://localhost:7880'
};

const SHOP = { YOOKASSA_SHOP_ID: '123456', YOOKASSA_SECRET_KEY: 'live_key' };

describe('validateEnv', () => {
  it('refuses a production shop that would send buyers back to localhost', () => {
    expect(() => validateEnv({ ...BASE, ...SHOP, NODE_ENV: 'production' })).toThrow(
      /YOOKASSA_RETURN_URL/
    );
  });

  it('accepts a production shop with a public return url', () => {
    const env = validateEnv({
      ...BASE,
      ...SHOP,
      NODE_ENV: 'production',
      YOOKASSA_RETURN_URL: 'https://app.chatovo.ru/lobby'
    });

    expect(env.YOOKASSA_RETURN_URL).toBe('https://app.chatovo.ru/lobby');
  });

  it('keeps the localhost default in development and with the shop off', () => {
    expect(() => validateEnv({ ...BASE, ...SHOP, NODE_ENV: 'development' })).not.toThrow();
    expect(() => validateEnv({ ...BASE, NODE_ENV: 'production' })).not.toThrow();
  });
});
