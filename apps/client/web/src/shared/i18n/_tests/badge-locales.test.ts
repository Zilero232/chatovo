import { BADGE_IDS } from '@chatovo/schemas';
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

const LOCALES = Object.entries({ en, ru, uk, es, pt, de, fr, tr, pl });

describe('badge locales', () => {
  it.each(LOCALES)('%s gives every badge its own name', (_, messages) => {
    const names = BADGE_IDS.map((id) => messages.badges.items[id].name);

    expect(names.filter((name, index) => names.indexOf(name) !== index)).toEqual([]);
  });
});
