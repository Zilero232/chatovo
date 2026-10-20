'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { useTranslations } from 'next-intl';
import { isNullish } from 'remeda';
import { toast } from 'sonner';

import { useAppSettings } from '@/entities/app/settings';
import { appEvents, isTauriDesktop, toggleMicStream } from '@/shared/lib';

import { toggleMicrophone } from '../../lib';

export const useShortcutActions = () => {
  const { localParticipant } = useLocalParticipant();
  const { settings } = useAppSettings();
  const t = useTranslations('room.shortcuts');

  const mode = settings.audio.activationMode;
  const enabled = isTauriDesktop() && !isNullish(localParticipant);

  appEvents.on.muteToggle(async () => {
    if (!enabled) {
      return;
    }

    await toggleMicrophone({
      localParticipant,
      isPtt: mode === 'pushToTalk',
      source: 'shortcut'
    });
  });

  appEvents.on.pttKey((payload) => {
    if (!enabled || mode !== 'pushToTalk') {
      return;
    }

    if (!localParticipant.isMicrophoneEnabled) {
      if (payload.phase === 'pressed') {
        toast.info(t('pttBlockedByMute'), { id: 'ptt-blocked-by-mute' });
      }
      return;
    }

    appEvents.emit.pttHold(payload);

    toggleMicStream(localParticipant, payload.phase === 'pressed');
  });
};
