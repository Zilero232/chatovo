import { useLocalParticipant, useLocalParticipantPermissions } from '@livekit/components-react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useAppSettings } from '@/entities/app/settings';
import { isMicLocked, useInvisibleGuard } from '@/entities/room/room';
import { armPttStream, isTauriDesktop, prettyHotkey } from '@/shared/lib';

import { resolveMicVisual } from '../../lib/mic-visual';
import { useDeafen } from './use-deafen';
import { useParticipantAction } from './use-participant-action';
import { usePttActive } from './use-ptt-active';

export const useMicControl = () => {
  const t = useTranslations('room.controls');

  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();
  const permissions = useLocalParticipantPermissions();
  const { settings } = useAppSettings();
  const { isInvisible, blockIfInvisible } = useInvisibleGuard();

  const { isDeafened, undeafen } = useDeafen();
  const pttState = usePttActive();

  const isPtt = settings.audio.activationMode === 'pushToTalk';
  const pttBinding = settings.shortcuts.pttHold;

  const isLocked = isMicLocked(permissions);
  const visual = resolveMicVisual({ pttState, isMicrophoneEnabled, isLocked });

  const { run, isPending } = useParticipantAction({
    participant: localParticipant,
    action: async (participant) => {
      if (blockIfInvisible()) {
        return;
      }

      if (isLocked) {
        toast.error(t('mutedByOwner'), { id: 'mic-muted-by-owner' });

        return;
      }

      const next = !participant.isMicrophoneEnabled;

      await participant.setMicrophoneEnabled(next);

      if (!next) {
        return;
      }

      if (isDeafened) {
        undeafen();
      }

      if (isPtt) {
        armPttStream(participant);
      }
    }
  });

  return {
    ...visual,
    isInvisible,
    isLocked,
    pttKey: isPtt && isTauriDesktop() && pttBinding ? prettyHotkey(pttBinding) : undefined,
    isPending,
    toggle: run
  };
};
