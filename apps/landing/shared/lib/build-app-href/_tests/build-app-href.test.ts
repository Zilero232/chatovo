import { afterEach, describe, expect, it, vi } from 'vitest';

const setAppUrl = (value: string) => {
  vi.doMock('@/shared/config', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@/shared/config')>()),
    env: { appUrl: value }
  }));

  return import('../build-app-href');
};

afterEach(() => {
  vi.resetModules();
  vi.doUnmock('@/shared/config');
});

describe('buildAppHref', () => {
  it('collapses the lobby to the bare app origin, which serves it as the front page', async () => {
    const { buildAppHref } = await setAppUrl('https://app.chatovo.ru');

    expect(buildAppHref('/lobby')).toBe('https://app.chatovo.ru');
  });

  it('keeps every other path under the app host', async () => {
    const { buildAppHref } = await setAppUrl('https://app.chatovo.ru');

    expect(buildAppHref('/auth')).toBe('https://app.chatovo.ru/auth');
    expect(buildAppHref('/room?id=abc')).toBe('https://app.chatovo.ru/room?id=abc');
  });
});
