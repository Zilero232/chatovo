import { useLocalParticipant } from '@livekit/components-react';

import { getScreenCaptureOptions, useAppSettings } from '@/entities/app/settings';
import { SHARED_AUDIO_PUBLISH } from '@/shared/lib';

import { useParticipantAction } from './use-participant-action';

export const useScreenControl = () => {
  const { localParticipant, isScreenShareEnabled } = useLocalParticipant();
  const { settings } = useAppSettings();

  const { run, isPending } = useParticipantAction({
    participant: localParticipant,
    action: (participant) =>
      participant.setScreenShareEnabled(
        !participant.isScreenShareEnabled,
        getScreenCaptureOptions(settings.video.screenQuality),
        SHARED_AUDIO_PUBLISH
      )
  });

  return { enabled: isScreenShareEnabled, isPending, toggle: run };
};
