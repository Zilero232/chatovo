import type { Locale } from './config';

import { de } from './locales/de';
import { en } from './locales/en';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { pl } from './locales/pl';
import { pt } from './locales/pt';
import { ru } from './locales/ru';
import { tr } from './locales/tr';
import { uk } from './locales/uk';

export type Messages = typeof en;

export const messages: Record<Locale, Messages> = { en, ru, uk, es, pt, de, fr, tr, pl };
