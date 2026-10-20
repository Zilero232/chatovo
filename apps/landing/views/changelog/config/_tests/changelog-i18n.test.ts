import { describe, expect, it } from 'vitest';

import { en } from '@/shared/i18n/locales/en';
import { ru } from '@/shared/i18n/locales/ru';

import { CHANGELOG_RELEASES } from '../releases';

const entryKeys = [...new Set(CHANGELOG_RELEASES.flatMap((r) => r.entries.map((e) => e.key)))];
const highlightKeys = [...new Set(CHANGELOG_RELEASES.flatMap((r) => r.highlights))];

const locales = { en, ru };

describe.each(Object.entries(locales))('changelog copy in %s', (_locale, messages) => {
  it('translates every entry key', () => {
    const missing = entryKeys.filter((key) => !(key in messages.changelog.entries));

    expect(missing).toEqual([]);
  });

  it('translates every highlight key', () => {
    const missing = highlightKeys.filter((key) => !(key in messages.changelog.highlights));

    expect(missing).toEqual([]);
  });

  it('translates every entry kind', () => {
    const kinds = [...new Set(CHANGELOG_RELEASES.flatMap((r) => r.entries.map((e) => e.kind)))];
    const missing = kinds.filter((kind) => !(kind in messages.changelog.kinds));

    expect(missing).toEqual([]);
  });

  it('translates every release tone', () => {
    const tones = [...new Set(CHANGELOG_RELEASES.map((release) => release.tone))];
    const missing = tones.filter((tone) => !(tone in messages.changelog.tones));

    expect(missing).toEqual([]);
  });
});

describe('changelog copy parity', () => {
  it('keeps the same entry keys in both locales', () => {
    expect(Object.keys(en.changelog.entries).sort()).toEqual(
      Object.keys(ru.changelog.entries).sort()
    );
  });

  it('keeps the same highlight keys in both locales', () => {
    expect(Object.keys(en.changelog.highlights).sort()).toEqual(
      Object.keys(ru.changelog.highlights).sort()
    );
  });
});
