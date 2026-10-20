import { uiMessages } from '@chatovo/ui-kit/messages';
import { describe, expect, it } from 'vitest';

import { en } from '../locales/en';
import enMarketing from '../locales/en/marketing.json';
import { ru } from '../locales/ru';

const EN_CHUNKS = {
  ui: uiMessages.en,
  marketing: enMarketing
};

const readPath = (path: string, messages: object): unknown =>
  path.split('.').reduce<unknown>((node, key) => (node as Record<string, unknown>)[key], messages);

const keyPaths = (value: unknown, prefix = ''): string[] => {
  if (typeof value !== 'object' || value === null) {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, child]) =>
    keyPaths(child, prefix ? `${prefix}.${key}` : key)
  );
};

describe('locale files', () => {
  it('expose the same key paths in both languages', () => {
    expect(keyPaths(ru).sort()).toEqual(keyPaths(en).sort());
  });

  it('keep the namespaces in the same order in both languages', () => {
    expect(Object.keys(ru)).toEqual(Object.keys(en));
  });

  it('resolves every key path to a string, never a stray object or null', () => {
    const broken = keyPaths(en).filter((path) => typeof readPath(path, en) !== 'string');

    expect(broken).toEqual([]);
  });

  it('translates every russian message rather than leaving the english text', () => {
    const untranslated = keyPaths(ru).filter((path) => {
      const value = readPath(path, ru);

      if (typeof value !== 'string' || value.length < 24) {
        return false;
      }

      return value === readPath(path, en);
    });

    expect(untranslated).toEqual([]);
  });
});

describe('locale chunks', () => {
  it('never define the same namespace twice', () => {
    const names = Object.values(EN_CHUNKS).flatMap((chunk) => Object.keys(chunk));

    expect(names.length).toBe(new Set(names).size);
  });

  it('together cover exactly the assembled locale', () => {
    const names = Object.values(EN_CHUNKS).flatMap((chunk) => Object.keys(chunk));

    expect(names.sort()).toEqual(Object.keys(en).sort());
  });
});
