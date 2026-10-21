import { RadioGroup, RadioGroupItem, Separator, Switch } from '@chatovo/ui-kit';
import { useId } from 'react';
import { useTranslations } from 'use-intl';

import type { Locale } from '@/shared/i18n';

import { useLocale } from '@/entities/app/locale';
import { useAppSettings } from '@/entities/app/settings';
import { LOCALE_NAMES, LOCALES } from '@/shared/i18n';

import { SettingRow } from '../components/SettingRow/SettingRow';

import s from '../AppSettingsButton.module.scss';

export const GeneralTab = () => {
  const t = useTranslations('settings.general');
  const tLanguage = useTranslations('language');
  const { locale, setLocale } = useLocale();
  const { settings, setGroup } = useAppSettings();

  const id = useId();

  return (
    <div className={s.profilePanel}>
      <section className={s.profileSection}>
        <div className={s.rowText}>
          <h3 className={s.profileSectionTitle}>{tLanguage('label')}</h3>
          <span className={s.rowHint}>{t('languageDescription')}</span>
        </div>

        <RadioGroup
          className={s.languageList}
          value={locale}
          onValueChange={(value) => setLocale(value as Locale)}
        >
          {LOCALES.map((code) => (
            <label key={code} className={s.languageOption} htmlFor={`${id}-${code}`}>
              <RadioGroupItem id={`${id}-${code}`} value={code} />
              <span lang={code}>{LOCALE_NAMES[code]}</span>
            </label>
          ))}
        </RadioGroup>
      </section>

      <Separator />

      <section className={s.profileSection}>
        <h3 className={s.profileSectionTitle}>{t('chat')}</h3>

        <SettingRow
          control={
            <Switch
              checked={settings.chat.filterProfanity}
              onCheckedChange={(filterProfanity) => setGroup('chat', { filterProfanity })}
            />
          }
          hint={t('filterProfanityHint')}
          label={t('filterProfanity')}
        />
      </section>
    </div>
  );
};
