import type { Locale } from './config';

import { en } from './locales/en';
import { ru } from './locales/ru';

export type Messages = typeof en;

export const messages: Record<Locale, Messages> = { en, ru };
