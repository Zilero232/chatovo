import { Select } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { Globe } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { LOCALE_NAMES, LOCALES } from '@/shared/i18n';

import type { LocaleSelectProps } from './LocaleSelect.types';

import { useLocale } from '../../model/hooks';

import s from './LocaleSelect.module.scss';

const LOCALE_OPTIONS = LOCALES.map((code) => ({ value: code, label: LOCALE_NAMES[code] }));

export const LocaleSelect = ({ variant = 'field', className }: LocaleSelectProps) => {
  const t = useTranslations('language');
  const { locale, setLocale } = useLocale();

  return (
    <Select
      aria-label={t('label')}
      className={clsx(variant === 'field' && s.root, className)}
      icon={variant === 'ghost' && <Globe />}
      options={LOCALE_OPTIONS}
      value={locale}
      variant={variant}
      onChange={setLocale}
    />
  );
};
