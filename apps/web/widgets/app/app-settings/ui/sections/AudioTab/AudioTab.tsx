'use client';

import { useTranslations } from 'next-intl';
import { isNullish } from 'remeda';

import type { AudioSettings, MicActivationMode } from '@/entities/app/settings';

import { useAppSettings } from '@/entities/app/settings';
import { useIsTauriDesktop } from '@/shared/hooks';

import type { AudioTabProps } from './AudioTab.types';

import { MicTest } from '../../components/MicTest/MicTest';
import { SettingRow } from '../../components/SettingRow/SettingRow';
import {
  AudioDevicesSection,
  AudioProcessingSection,
  MicActivationSection,
  SensitivitySection
} from './components';

import s from '../../AppSettingsButton.module.scss';

export const AudioTab = ({ onJumpToShortcuts }: AudioTabProps) => {
  const t = useTranslations('settings.audio');
  const { settings, setGroup } = useAppSettings();

  const isDesktop = useIsTauriDesktop();

  const audio = settings.audio;
  const pttBindingMissing =
    audio.activationMode === 'pushToTalk' && isNullish(settings.shortcuts.pttHold);

  const setFlag = (key: keyof AudioSettings, value: boolean) => {
    setGroup('audio', { [key]: value });
  };

  const setActivationMode = (value: MicActivationMode) => {
    setGroup('audio', { activationMode: value });
  };

  const showVoiceActivityControls = !isDesktop || audio.activationMode === 'voiceActivity';

  return (
    <div className={s.tabPanel}>
      {isDesktop && (
        <MicActivationSection
          activationMode={audio.activationMode}
          pttBindingMissing={pttBindingMissing}
          onActivationModeChange={setActivationMode}
          onJumpToShortcuts={onJumpToShortcuts}
        />
      )}

      <AudioDevicesSection />

      {showVoiceActivityControls && (
        <SensitivitySection
          audio={audio}
          deviceId={settings.devices.audioInput}
          onAutoSensitivityChange={(value) => setGroup('audio', { autoSensitivity: value })}
        />
      )}

      <SettingRow
        stacked
        control={<MicTest audio={audio} deviceId={settings.devices.audioInput} />}
        hint={t('testMicHint')}
        label={t('testMic')}
      />

      <AudioProcessingSection audio={audio} onFlagChange={setFlag} />
    </div>
  );
};
