'use client';

import type { SoundboardSound } from '@chatovo/schemas';

import { useRoomContext } from '@livekit/components-react';

import { useRealtime, useRealtimeMessage } from '@/entities/app/realtime';
import { useAppSettings } from '@/entities/app/settings';
import { useCurrentUser } from '@/entities/auth/user';

import { playSoundboardSound } from '../../lib/play-soundboard-sound';

export const useSoundboard = () => {
  const roomId = useRoomContext().name;

  const { send } = useRealtime();
  const { isAdmin } = useCurrentUser();
  const { settings } = useAppSettings();

  const volume = settings.sounds.enabled.reaction ? settings.sounds.volume : 0;

  useRealtimeMessage((message) => {
    if (message.type !== 'room.soundboard' || message.roomId !== roomId) {
      return;
    }

    playSoundboardSound(message.sound, volume);
  });

  const play = (sound: SoundboardSound) => {
    if (!isAdmin) {
      return;
    }

    playSoundboardSound(sound, volume);
    send({ op: 'room.soundboard', roomId, sound });
  };

  return { isAdmin, play };
};
