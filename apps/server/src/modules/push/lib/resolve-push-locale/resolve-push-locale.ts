import type { PushLocale } from '../../config';

import { DEFAULT_PUSH_LOCALE, PUSH_LOCALES } from '../../config';

const isPushLocale = (value: string): value is PushLocale =>
  (PUSH_LOCALES as readonly string[]).includes(value);

export const resolvePushLocale = (value: string | null | undefined): PushLocale => {
  const language = (value ?? '').trim().slice(0, 2).toLowerCase();

  return isPushLocale(language) ? language : DEFAULT_PUSH_LOCALE;
};
