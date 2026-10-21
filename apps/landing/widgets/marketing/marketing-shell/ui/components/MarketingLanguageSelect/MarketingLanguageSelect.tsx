'use client';

import { Select } from '@chatovo/ui-kit';
import { useRouter } from 'next/navigation';

import { STORAGE_KEYS } from '@/shared/constants';
import { LOCALE_NAMES, LOCALES } from '@/shared/i18n';

import type { MarketingLanguageSelectProps } from './MarketingLanguageSelect.types';

const LANGUAGE_OPTIONS = LOCALES.map((code) => ({ value: code, label: LOCALE_NAMES[code] }));

export const MarketingLanguageSelect = ({
  locale,
  hrefs,
  label,
  className,
  onNavigate
}: MarketingLanguageSelectProps) => {
  const router = useRouter();

  return (
    <Select
      aria-label={label}
      className={className}
      options={LANGUAGE_OPTIONS}
      value={locale}
      onChange={(next) => {
        sessionStorage.setItem(STORAGE_KEYS.homeLocaleRedirected, '1');
        onNavigate?.();
        router.push(hrefs[next]);
      }}
    />
  );
};
