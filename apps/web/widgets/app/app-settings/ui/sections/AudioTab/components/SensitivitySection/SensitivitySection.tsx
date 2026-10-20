'use client';

import { Switch } from '@chatovo/ui-kit';
import { useTranslations } from 'next-intl';

import type { SensitivitySectionProps } from './SensitivitySection.types';

import { SensitivityControl } from '../../../../components/SensitivityControl/SensitivityControl';
import { SettingRow } from '../../../../components/SettingRow/SettingRow';

export const SensitivitySection = ({
  audio,
  deviceId,
  onAutoSensitivityChange
}: SensitivitySectionProps) => {
  const t = useTranslations('settings.audio');

  return (
    <>
      <SettingRow
        control={
          <Switch checked={audio.autoSensitivity} onCheckedChange={onAutoSensitivityChange} />
        }
        hint={t('autoSensitivityHint')}
        label={t('autoSensitivity')}
      />

      {!audio.autoSensitivity && (
        <SettingRow
          stacked
          control={<SensitivityControl audio={audio} deviceId={deviceId} />}
          hint={t('sensitivityHint')}
          label={t('sensitivity')}
        />
      )}
    </>
  );
};
