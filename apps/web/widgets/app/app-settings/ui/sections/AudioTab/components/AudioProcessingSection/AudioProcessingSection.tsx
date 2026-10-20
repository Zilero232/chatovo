import { Switch } from '@chatovo/ui-kit';
import { useTranslations } from 'use-intl';

import type { AudioProcessingSectionProps } from './AudioProcessingSection.types';

import { SettingRow } from '../../../../components/SettingRow/SettingRow';
import { AUDIO_FLAGS } from '../../AudioTab.config';

export const AudioProcessingSection = ({ audio, onFlagChange }: AudioProcessingSectionProps) => {
  const t = useTranslations('settings.audio');

  return (
    <>
      {AUDIO_FLAGS.map((flag) => (
        <SettingRow
          key={flag}
          control={
            <Switch checked={audio[flag]} onCheckedChange={(value) => onFlagChange(flag, value)} />
          }
          hint={t(`${flag}Hint`)}
          label={t(flag)}
        />
      ))}
    </>
  );
};
