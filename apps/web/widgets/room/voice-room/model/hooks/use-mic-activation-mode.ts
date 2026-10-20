'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { useEffect } from 'react';
import { isNullish } from 'remeda';

import { useAppSettings } from '@/entities/app/settings';
import { armPttStream } from '@/shared/lib';

export const useMicActivationMode = () => {
  const { settings } = useAppSettings();
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();

  const mode = settings.audio.activationMode;

  useEffect(() => {
    if (isNullish(localParticipant) || !isMicrophoneEnabled || mode !== 'pushToTalk') {
      return;
    }

    armPttStream(localParticipant);
  }, [mode, localParticipant, isMicrophoneEnabled]);
};
