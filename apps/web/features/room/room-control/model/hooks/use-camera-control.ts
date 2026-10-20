'use client';

import { useLocalParticipant } from '@livekit/components-react';

import { getCameraCaptureOptions, useAppSettings } from '@/entities/app/settings';

import { isOverconstrained } from '../../lib/media-errors';
import { useParticipantAction } from './use-participant-action';

export const useCameraControl = () => {
  const { localParticipant, isCameraEnabled } = useLocalParticipant();
  const { settings } = useAppSettings();

  const { run, isPending } = useParticipantAction({
    participant: localParticipant,
    action: async (participant) => {
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

  return { enabled: isCameraEnabled, isPending, toggle: run };
};
