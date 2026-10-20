'use client';

import { Slider as BaseSlider } from '@base-ui/react/slider';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

import {
  useAppSettings,
  VOICE_GATE_MANUAL_RANGE,
  VoiceGateDetector
} from '@/entities/app/settings';
import { formatPercent } from '@/shared/lib';

import type { SensitivityControlProps } from './SensitivityControl.types';

import { useMicAnalyser } from '../../../model/hooks';

import s from '../../AppSettingsButton.module.scss';

export const SensitivityControl = ({ deviceId, audio }: SensitivityControlProps) => {
  const t = useTranslations('settings.audio');
  const { setGroup } = useAppSettings();

  const level = useMicAnalyser({ deviceId, audio, active: true });
  const gateRef = useRef(new VoiceGateDetector());
  const gateKey = `${audio.autoSensitivity}:${audio.micThreshold}`;
  const gateKeyRef = useRef(gateKey);

  if (gateKeyRef.current !== gateKey) {
    gateKeyRef.current = gateKey;
    gateRef.current.reset();
  }

  const open = gateRef.current.step(level, {
    autoSensitivity: audio.autoSensitivity,
    threshold: audio.micThreshold
  });

  return (
    <BaseSlider.Root
      aria-label={t('sensitivity')}
      className={s.sensitivitySlider}
      max={1}
      min={0}
      step={0.01}
      value={audio.micThreshold}
      onValueChange={(value) => setGroup('audio', { micThreshold: value as number })}
    >
      <BaseSlider.Control className={s.meterTrack}>
        <div
          className={s.meterFill}
          data-open={open}
          style={{ width: formatPercent(level / VOICE_GATE_MANUAL_RANGE) }}
        />
        <BaseSlider.Thumb className={s.sensitivityThumb} />
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
};
