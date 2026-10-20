import { isNullish } from 'remeda';

/** Cuts the domain off a value that looks like an email, so addresses never reach the UI. */
export const stripEmailDomain = (value: string | null | undefined): string | null => {
  if (isNullish(value)) {
    return null;
  }

  const local = value.split('@')[0].trim();

  return local.length > 0 ? local : null;
};
