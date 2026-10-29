import { describe, expect, it } from 'vitest';

import { resolvePushLocale } from '../resolve-push-locale';

describe('resolvePushLocale', () => {
  it('keeps a supported app locale', () => {
    expect(resolvePushLocale('ru')).toBe('ru');
  });

  it('reads the language out of a region tag', () => {
    expect(resolvePushLocale('pt-BR')).toBe('pt');
  });

  it('falls back to English for an unknown, empty or missing locale', () => {
    expect(resolvePushLocale('ja')).toBe('en');
    expect(resolvePushLocale('')).toBe('en');
    expect(resolvePushLocale(null)).toBe('en');
  });
});
