import { isNullish } from 'remeda';

/** Отрезает домен, если строка выглядит как email — чтобы почта не утекала в UI. */
export const stripEmailDomain = (value: string | null | undefined): string | null => {
  if (isNullish(value)) {
    return null;
  }

  const local = value.split('@')[0].trim();

  return local.length > 0 ? local : null;
};
