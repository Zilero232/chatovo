import { Switch } from '@chatovo/ui-kit';
import { useTranslations } from 'use-intl';

import { useAppSettings } from '@/entities/app/settings';
import { useIsTauriDesktop } from '@/shared/hooks';

import { SettingRow } from '../components/SettingRow/SettingRow';

import s from '../AppSettingsButton.module.scss';

export const SystemTab = () => {
  const t = useTranslations('settings.system');
  const { settings, setGroup } = useAppSettings();

  const isDesktop = useIsTauriDesktop();

  const { tray, shareActivity } = settings.system;

  return (
    <div className={s.tabPanel}>
      <SettingRow
        control={
          <Switch
            checked={tray.closeToTray}
            onCheckedChange={(value) =>
              setGroup('system', { tray: { ...tray, closeToTray: value } })
            }
          />
        }
        hint={t('closeToTrayHint')}
        label={t('closeToTray')}
      />

      {isDesktop && (
        <SettingRow
          control={
            <Switch
              checked={shareActivity}
              onCheckedChange={(value) => setGroup('system', { shareActivity: value })}
            />
          }
          hint={t('shareActivityHint')}
          label={t('shareActivity')}
        />
      )}
    </div>
  );
};
