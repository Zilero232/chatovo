import { uiMessages } from '@chatovo/ui-kit/messages';
import { describe, expect, it } from 'vitest';

import { de } from '../locales/de';
import { en } from '../locales/en';
import enMarketing from '../locales/en/marketing.json';
import { es } from '../locales/es';
import { fr } from '../locales/fr';
import { pl } from '../locales/pl';
import { pt } from '../locales/pt';
import { ru } from '../locales/ru';
import { tr } from '../locales/tr';
import { uk } from '../locales/uk';

const TRANSLATIONS = Object.entries({ ru, uk, es, pt, de, fr, tr, pl });

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
  it.each(TRANSLATIONS)('%s exposes the same key paths as english', (_, messages) => {
    expect(keyPaths(messages).sort()).toEqual(keyPaths(en).sort());
  });

  it.each(TRANSLATIONS)('%s keeps the namespaces in the english order', (_, messages) => {
    expect(Object.keys(messages)).toEqual(Object.keys(en));
  });

  it('resolves every key path to a string, never a stray object or null', () => {
    const broken = keyPaths(en).filter((path) => typeof readPath(path, en) !== 'string');

    expect(broken).toEqual([]);
  });

  it.each([['en', en] as const, ...TRANSLATIONS])(
    '%s never puts an ICU-escaping apostrophe before a tag, a brace or #',
    (_, messages) => {
      const escaped = keyPaths(messages).filter((path) => {
        const value = readPath(path, messages);

        return typeof value === 'string' && /'[{}#<|]/.test(value);
      });

      expect(escaped).toEqual([]);
    }
  );

  it.each(TRANSLATIONS)(
    '%s translates every message rather than leaving the english text',
    (_, messages) => {
      const untranslated = keyPaths(messages).filter((path) => {
        const value = readPath(path, messages);

        if (typeof value !== 'string' || value.length < 24) {
          return false;
        }

        return value === readPath(path, en);
      });

      expect(untranslated).toEqual([]);
    }
  );
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
