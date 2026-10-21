import { apiErrorCodeSchema } from '@chatovo/schemas';
import { describe, expect, it } from 'vitest';

import { de } from '../locales/de';
import { en } from '../locales/en';
import { es } from '../locales/es';
import { fr } from '../locales/fr';
import { pl } from '../locales/pl';
import { pt } from '../locales/pt';
import { ru } from '../locales/ru';
import { tr } from '../locales/tr';
import { uk } from '../locales/uk';

const CODES = apiErrorCodeSchema.options;

const LOCALES = Object.entries({ en, ru, uk, es, pt, de, fr, tr, pl });

describe('error locales', () => {
  it.each(LOCALES)('%s translates every code the API can return', (_, messages) => {
    expect(CODES.filter((code) => !(code in messages.errors))).toEqual([]);
  });

  it.each(LOCALES)('%s has no translation for a code the schema does not know', (_, messages) => {
    const known = new Set<string>(CODES);

    expect(Object.keys(messages.errors).filter((key) => !known.has(key))).toEqual([]);
  });

  it.each(LOCALES)('%s has no empty message', (_, messages) => {
    for (const message of Object.values(messages.errors)) {
      expect(message.trim().length).toBeGreaterThan(0);
    }
  });
});
