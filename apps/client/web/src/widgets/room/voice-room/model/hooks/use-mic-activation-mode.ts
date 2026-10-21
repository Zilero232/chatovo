import { useLocalParticipant } from '@livekit/components-react';
import { TrackEvent } from 'livekit-client';
import { useEffect } from 'react';
import { isNullish } from 'remeda';

import { useAppSettings } from '@/entities/app/settings';
import { armPttStream } from '@/shared/lib';

import { getLocalMicTrack } from '../../lib';

const REARM_EVENTS = [TrackEvent.Restarted, TrackEvent.TrackProcessorUpdate] as const;

export const useMicActivationMode = () => {
  const { settings } = useAppSettings();
  const { localParticipant, isMicrophoneEnabled, microphoneTrack } = useLocalParticipant();

  const mode = settings.audio.activationMode;
  const micTrack = microphoneTrack?.track;

  useEffect(() => {
    if (isNullish(localParticipant) || !isMicrophoneEnabled || mode !== 'pushToTalk') {
      return;
    }

    const track = getLocalMicTrack(localParticipant);
    const arm = () => armPttStream(localParticipant);

    arm();
    REARM_EVENTS.forEach((event) => track?.on(event, arm));

    return () => {
      REARM_EVENTS.forEach((event) => track?.off(event, arm));
    };
  }, [mode, localParticipant, isMicrophoneEnabled, micTrack]);
};
