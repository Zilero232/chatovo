'use client';

import { RadioGroup, RadioGroupItem } from '@chatovo/ui-kit';
import { useTranslations } from 'next-intl';
import { useId } from 'react';

import type { MicActivationMode } from '@/entities/app/settings';

import type { MicActivationSectionProps } from './MicActivationSection.types';

import { SettingRow } from '../../../../components/SettingRow/SettingRow';

import s from '../../../../AppSettingsButton.module.scss';

export const MicActivationSection = ({
  activationMode,
  pttBindingMissing,
  onActivationModeChange,
  onJumpToShortcuts
}: MicActivationSectionProps) => {
  const t = useTranslations('settings.audio');

  const voiceId = useId();
  const pttId = useId();

  return (
    <>
      <SettingRow
        stacked
        control={
          <RadioGroup
            className={s.radioGroup}
            value={activationMode}
            onValueChange={(value) => onActivationModeChange(value as MicActivationMode)}
          >
            <label className={s.radioLabel} htmlFor={voiceId}>
              <RadioGroupItem id={voiceId} value='voiceActivity' />
              {t('activationVoice')}
            </label>
            <label className={s.radioLabel} htmlFor={pttId}>
              <RadioGroupItem id={pttId} value='pushToTalk' />
              {t('activationPtt')}
            </label>
          </RadioGroup>
        }
        hint={t('activationHint')}
        label={t('activation')}
      />

      {pttBindingMissing && (
        <span className={s.rowHintTight}>
          {t.rich('activationPttNoBinding', {
            link: (chunks) => (
              <button className={s.linkButton} type='button' onClick={onJumpToShortcuts}>
                {chunks}
              </button>
            )
          })}
        </span>
      )}
    </>
  );
};
