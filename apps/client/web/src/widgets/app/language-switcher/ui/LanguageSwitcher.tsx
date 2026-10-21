import { Select } from '@chatovo/ui-kit';
import { useTranslations } from 'use-intl';

import { useLocale } from '@/entities/app/locale';
import { LOCALE_NAMES, LOCALES } from '@/shared/i18n';

import s from './LanguageSwitcher.module.scss';

const LANGUAGE_OPTIONS = LOCALES.map((code) => ({ value: code, label: LOCALE_NAMES[code] }));

export const LanguageSwitcher = () => {
  const t = useTranslations('language');
  const { locale, setLocale } = useLocale();

  return (
    <Select
      aria-label={t('label')}
      className={s.root}
      options={LANGUAGE_OPTIONS}
      value={locale}
      onChange={setLocale}
    />
  );
};
