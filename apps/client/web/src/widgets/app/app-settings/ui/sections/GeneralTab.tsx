import { Switch } from '@chatovo/ui-kit';
import { useTranslations } from 'use-intl';

import { LocaleSelect } from '@/entities/app/locale';
import { useAppSettings } from '@/entities/app/settings';

import { SettingRow } from '../components/SettingRow/SettingRow';
import { SettingsCard } from '../components/SettingsCard/SettingsCard';

import s from '../AppSettingsButton.module.scss';

export const GeneralTab = () => {
  const t = useTranslations('settings.general');
  const tLanguage = useTranslations('language');
  const { settings, setGroup } = useAppSettings();

  return (
    <div className={s.tabPanel}>
      <SettingsCard title={tLanguage('label')}>
        <SettingRow
          control={<LocaleSelect />}
          hint={t('languageDescription')}
          label={tLanguage('label')}
        />
      </SettingsCard>

      <SettingsCard title={t('chat')}>
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
      </SettingsCard>
    </div>
  );
};
