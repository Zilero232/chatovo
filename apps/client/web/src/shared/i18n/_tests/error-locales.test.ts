import { apiErrorCodeSchema } from '@chatovo/schemas';
import { describe, expect, it } from 'vitest';

import { en } from '../locales/en';
import { ru } from '../locales/ru';

const CODES = apiErrorCodeSchema.options;

describe('error locales', () => {
  it('translates every code the API can return', () => {
    const missingRu = CODES.filter((code) => !(code in ru.errors));
    const missingEn = CODES.filter((code) => !(code in en.errors));

    expect(missingRu).toEqual([]);
    expect(missingEn).toEqual([]);
  });

  it('has no translation for a code the schema does not know', () => {
    const known = new Set<string>(CODES);

    expect(Object.keys(ru.errors).filter((key) => !known.has(key))).toEqual([]);
    expect(Object.keys(en.errors).filter((key) => !known.has(key))).toEqual([]);
  });

  it('keeps both locales in sync with each other', () => {
    expect(Object.keys(ru.errors).sort()).toEqual(Object.keys(en.errors).sort());
  });

  it('has no empty message', () => {
    for (const message of [...Object.values(ru.errors), ...Object.values(en.errors)]) {
      expect(message.trim().length).toBeGreaterThan(0);
    }
  });
});
