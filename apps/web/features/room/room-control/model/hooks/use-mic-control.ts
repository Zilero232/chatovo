'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useAppSettings } from '@/entities/app/settings';
import { useCurrentUser } from '@/entities/auth/user';
import { armPttStream, isTauriDesktop, prettyHotkey } from '@/shared/lib';

import { resolveMicVisual } from '../../lib/mic-visual';
import { useDeafen } from './use-deafen';
import { useParticipantAction } from './use-participant-action';
import { usePttActive } from './use-ptt-active';

export const useMicControl = () => {
  const t = useTranslations('room.controls');

  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();
  const { settings } = useAppSettings();
  const { isAdmin } = useCurrentUser();

  const isInvisible = isAdmin && settings.system.invisibleMode;

  const { isDeafened, undeafen } = useDeafen();
  const pttState = usePttActive();

  const isPtt = settings.audio.activationMode === 'pushToTalk';
  const pttBinding = settings.shortcuts.pttHold;

  const visual = resolveMicVisual({ pttState, isMicrophoneEnabled });

  const { run, isPending } = useParticipantAction({
    participant: localParticipant,
    action: async (participant) => {
      if (isInvisible) {
        toast.error(t('invisibleMicBlocked'), { id: 'invisible-mic' });

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
    isDisabled: isInvisible,
    pttKey: isPtt && isTauriDesktop() && pttBinding ? prettyHotkey(pttBinding) : undefined,
    isPending,
    toggle: run
  };
};
