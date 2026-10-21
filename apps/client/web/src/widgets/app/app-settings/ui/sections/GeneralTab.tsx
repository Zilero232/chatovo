import { Separator, Switch } from '@chatovo/ui-kit';
import { useTranslations } from 'use-intl';

import { LocaleSelect } from '@/entities/app/locale';
import { useAppSettings } from '@/entities/app/settings';

import { SettingRow } from '../components/SettingRow/SettingRow';

import s from '../AppSettingsButton.module.scss';

export const GeneralTab = () => {
  const t = useTranslations('settings.general');
  const tLanguage = useTranslations('language');
  const { settings, setGroup } = useAppSettings();

  return (
    <div className={s.profilePanel}>
      <section className={s.profileSection}>
        <SettingRow
          control={<LocaleSelect />}
          hint={t('languageDescription')}
          label={tLanguage('label')}
        />
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
