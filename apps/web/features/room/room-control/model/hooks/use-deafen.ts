'use client';

import type { LocalParticipant } from 'livekit-client';

import { useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { isNullish } from 'remeda';

import { useRealtime } from '@/entities/app/realtime';
import { useAppSettings } from '@/entities/app/settings';
import { armPttStream } from '@/shared/lib';

import { useDeafenContext } from '../contexts/deafen-context';

export const useDeafen = () => {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const { settings } = useAppSettings();
  const { send } = useRealtime();

  const { isDeafened, setIsDeafened, micBeforeDeafenRef, deafenQueueRef, deafenedRef } =
    useDeafenContext();

  const isPtt = settings.audio.activationMode === 'pushToTalk';

  const enableDeafen = async (p: LocalParticipant, wasDeafened: boolean) => {
    if (!wasDeafened) {
      micBeforeDeafenRef.current = p.isMicrophoneEnabled;
    }

    await p.setMicrophoneEnabled(false);
  };

  const disableDeafen = async (p: LocalParticipant) => {
    if (!micBeforeDeafenRef.current) {
      return;
    }

    await p.setMicrophoneEnabled(true);

    if (isPtt) {
      armPttStream(p);
    }
  };

  const publishDeafened = (value: boolean) => {
    deafenedRef.current = value;
    setIsDeafened(value);
    send({
      op: 'presence.patch',
      roomId: room.name,
      deafened: value
    });
  };

  const setDeafened = (next: boolean) => {
    if (isNullish(localParticipant)) {
      return deafenQueueRef.current;
    }

    const wasDeafened = deafenedRef.current;

    publishDeafened(next);

    deafenQueueRef.current = deafenQueueRef.current.then(async () => {
      try {
        await (next
          ? enableDeafen(localParticipant, wasDeafened)
          : disableDeafen(localParticipant));
      } catch (err) {
        console.error('deafen toggle failed', err);

        publishDeafened(wasDeafened);
      }
    });

    return deafenQueueRef.current;
  };

  return {
    isDeafened,
    toggle: () => setDeafened(!deafenedRef.current),
    undeafen: () => setDeafened(false)
  };
};
