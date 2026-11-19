import { useLocalParticipant } from '@livekit/components-react';

import {
  getScreenCaptureOptions,
  getScreenPublishOptions,
  useAppSettings
} from '@/entities/app/settings';
import { useInvisibleGuard } from '@/entities/room/room';

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
        getScreenCaptureOptions({
          quality: settings.video.screenQuality,
          content: settings.video.screenContent
        }),
        getScreenPublishOptions(settings.video.screenContent)
      );
    }
  });

  return { enabled: isScreenShareEnabled, isInvisible, isPending, toggle: run };
};
