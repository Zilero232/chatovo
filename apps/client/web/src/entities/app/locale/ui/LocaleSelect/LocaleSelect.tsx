import { Select } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { useTranslations } from 'use-intl';

import { LOCALE_NAMES, LOCALES } from '@/shared/i18n';

import type { LocaleSelectProps } from './LocaleSelect.types';

import { useLocale } from '../../model/hooks';

import s from './LocaleSelect.module.scss';

const LOCALE_OPTIONS = LOCALES.map((code) => ({ value: code, label: LOCALE_NAMES[code] }));

export const LocaleSelect = ({ className }: LocaleSelectProps) => {
  const t = useTranslations('language');
  const { locale, setLocale } = useLocale();

  return (
    <Select
      aria-label={t('label')}
      className={clsx(s.root, className)}
      options={LOCALE_OPTIONS}
      value={locale}
      onChange={setLocale}
    />
  );
};
