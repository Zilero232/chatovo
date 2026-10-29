import { useLocalParticipant } from '@livekit/components-react';

import { getCameraCaptureOptions, useAppSettings } from '@/entities/app/settings';
import { useInvisibleGuard } from '@/entities/room/room';

import { isOverconstrained } from '../../lib/media-errors';
import { useParticipantAction } from './use-participant-action';

export const useCameraControl = () => {
  const { localParticipant, isCameraEnabled } = useLocalParticipant();
  const { settings } = useAppSettings();
  const { isInvisible, blockIfInvisible } = useInvisibleGuard();

  const { run, isPending } = useParticipantAction({
    participant: localParticipant,
    action: async (participant) => {
      if (blockIfInvisible()) {
        return;
      }

      if (participant.isCameraEnabled) {
        await participant.setCameraEnabled(false);

        return;
      }

      try {
        await participant.setCameraEnabled(
          true,
          getCameraCaptureOptions(settings.video.cameraQuality)
        );
      } catch (err) {
        if (!isOverconstrained(err)) {
          throw err;
        }

        await participant.setCameraEnabled(true);
      }
    }
  });

  return { enabled: isCameraEnabled, isInvisible, isPending, toggle: run };
};
