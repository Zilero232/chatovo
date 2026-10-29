import { useLocalParticipant } from '@livekit/components-react';

import { getScreenCaptureOptions, useAppSettings } from '@/entities/app/settings';
import { useInvisibleGuard } from '@/entities/room/room';
import { SHARED_AUDIO_PUBLISH } from '@/shared/lib';

import { useParticipantAction } from './use-participant-action';

export const useScreenControl = () => {
  const { localParticipant, isScreenShareEnabled } = useLocalParticipant();
  const { settings } = useAppSettings();
  const { isInvisible, blockIfInvisible } = useInvisibleGuard();

  const { run, isPending } = useParticipantAction({
    participant: localParticipant,
    action: async (participant) => {
      if (blockIfInvisible()) {
        return;
      }

      await participant.setScreenShareEnabled(
        !participant.isScreenShareEnabled,
        getScreenCaptureOptions(settings.video.screenQuality),
        SHARED_AUDIO_PUBLISH
      );
    }
  });

  return { enabled: isScreenShareEnabled, isInvisible, isPending, toggle: run };
};
