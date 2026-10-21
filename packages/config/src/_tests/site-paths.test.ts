import { describe, expect, it } from 'vitest';

import { localizeSitePath, SITE_PATHS, siteUrl } from '../site-paths';

describe('localizeSitePath', () => {
  it('keeps Russian paths bare', () => {
    expect(localizeSitePath({ path: SITE_PATHS.home, locale: 'ru' })).toBe('/');
    expect(localizeSitePath({ path: SITE_PATHS.features, locale: 'ru' })).toBe('/features');
  });

  it.each(['en', 'uk', 'de'] as const)('prefixes %s paths with the locale', (locale) => {
    expect(localizeSitePath({ path: SITE_PATHS.features, locale })).toBe(`/${locale}/features`);
  });

  it('maps a home page to the bare prefix without a trailing slash', () => {
    expect(localizeSitePath({ path: SITE_PATHS.home, locale: 'pt' })).toBe('/pt');
  });
});

describe('siteUrl', () => {
  it('builds an absolute link to the page in that language', () => {
    expect(siteUrl({ path: SITE_PATHS.privacy, locale: 'de' })).toBe(
      'https://chatovo.ru/de/privacy'
    );
    expect(siteUrl({ path: SITE_PATHS.terms, locale: 'ru' })).toBe('https://chatovo.ru/terms');
  });
});
