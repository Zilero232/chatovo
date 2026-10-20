'use client';

import { useAppSettings } from '@/entities/app/settings';

import { useLocalSpeaking } from '../../../model/contexts';
import { usePttLocalSpeaking, useVoiceGate } from '../../../model/hooks';

export const LocalSpeakingController = () => {
  const { settings } = useAppSettings();
  const { setIsSpeaking } = useLocalSpeaking();

  const isVoiceActivity = settings.audio.activationMode === 'voiceActivity';

  useVoiceGate(isVoiceActivity, setIsSpeaking);
  usePttLocalSpeaking(!isVoiceActivity, setIsSpeaking);

  return null;
};
