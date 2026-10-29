import { useLocalParticipant } from '@livekit/components-react';
import { useRef } from 'react';
import { isNullish } from 'remeda';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useAppSettings } from '@/entities/app/settings';
import { isMicLocked, useInvisibleGuard } from '@/entities/room/room';
import { appEvents, isTauriDesktop, toggleMicStream } from '@/shared/lib';

import { toggleMicrophone } from '../../lib';

export const useShortcutActions = () => {
  const { localParticipant } = useLocalParticipant();
  const { settings } = useAppSettings();
  const { blockIfInvisible } = useInvisibleGuard();
  const t = useTranslations('room.shortcuts');
  const tControls = useTranslations('room.controls');

  const isHeldRef = useRef(false);

  const mode = settings.audio.activationMode;
  const enabled = isTauriDesktop() && !isNullish(localParticipant);

  appEvents.on.muteToggle(async () => {
    if (!enabled) {
      return;
    }

    if (blockIfInvisible()) {
      return;
    }

    await toggleMicrophone({
      localParticipant,
      isPtt: mode === 'pushToTalk',
      source: 'shortcut',
      onLocked: () => toast.info(tControls('mutedByOwner'), { id: 'mic-muted-by-owner' })
    });
  });

  appEvents.on.pttKey((payload) => {
    if (!enabled || mode !== 'pushToTalk') {
      return;
    }

    if (payload.phase === 'released') {
      if (!isHeldRef.current) {
        return;
      }

      isHeldRef.current = false;
      appEvents.emit.pttHold(payload);
      toggleMicStream(localParticipant, false);

      return;
    }

    if (blockIfInvisible()) {
      return;
    }

    if (isMicLocked(localParticipant.permissions)) {
      toast.info(tControls('mutedByOwner'), { id: 'mic-muted-by-owner' });

      return;
    }

    if (!localParticipant.isMicrophoneEnabled) {
      toast.info(t('pttBlockedByMute'), { id: 'ptt-blocked-by-mute' });

      return;
    }

    isHeldRef.current = true;
    appEvents.emit.pttHold(payload);
    toggleMicStream(localParticipant, true);
  });
};
