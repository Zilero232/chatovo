import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/shared/constants';

import { localizeMarketingPath } from '../localize-marketing-path';

describe('localizeMarketingPath', () => {
  it('keeps Russian paths bare', () => {
    expect(localizeMarketingPath({ path: ROUTES.home, locale: 'ru' })).toBe(ROUTES.home);
    expect(localizeMarketingPath({ path: ROUTES.features, locale: 'ru' })).toBe(ROUTES.features);
  });

  it('prefixes English paths with /en', () => {
    expect(localizeMarketingPath({ path: ROUTES.features, locale: 'en' })).toBe('/en/features');
    expect(localizeMarketingPath({ path: ROUTES.changelog, locale: 'en' })).toBe('/en/changelog');
  });

  it('maps the English home page to /en without a trailing slash', () => {
    expect(localizeMarketingPath({ path: ROUTES.home, locale: 'en' })).toBe(ROUTES.homeEn);
  });
});
