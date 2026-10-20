'use client';

import { useTranslations } from 'next-intl';

import { DeviceSelect } from '../../../../components/DeviceSelect/DeviceSelect';
import { SettingRow } from '../../../../components/SettingRow/SettingRow';

export const AudioDevicesSection = () => {
  const t = useTranslations('settings.audio');
  const tDevices = useTranslations('settings.devices');

  return (
    <>
      <SettingRow
        stacked
        control={<DeviceSelect kind='audioinput' />}
        hint={t('microphoneHint')}
        label={t('microphone')}
      />

      <SettingRow
        stacked
        control={<DeviceSelect emptyLabel={tDevices('systemDefault')} kind='audiooutput' />}
        hint={t('speakersHint')}
        label={t('speakers')}
      />
    </>
  );
};
