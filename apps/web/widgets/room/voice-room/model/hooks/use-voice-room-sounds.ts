'use client';

import type { TrackPublication } from 'livekit-client';

import { useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { usePrevious } from '@siberiacancode/reactuse';
import { ParticipantEvent, RoomEvent, Track } from 'livekit-client';
import { useEffect, useEffectEvent, useMemo, useRef } from 'react';

import { useAppSettings } from '@/entities/app/settings';
import { useCurrentUser } from '@/entities/auth/user';
import { useLeaveSound } from '@/entities/room/room';
import { useDeafen } from '@/features/room/room-control';
import { useEmitterEvent } from '@/shared/hooks';
import { appEvents } from '@/shared/lib';

import type { SoundKey } from '../../config';

import { SOUND_CATEGORY } from '../../config';
import { createSoundPlayer } from '../../lib';

export const useVoiceRoomSounds = (roomId: string) => {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();

  const playLeave = useLeaveSound();

  const { isDeafened } = useDeafen();
  const { settings } = useAppSettings();
  const { isAdmin } = useCurrentUser();

  const isInvisible = isAdmin && settings.system.invisibleMode;

  const player = useMemo(createSoundPlayer, []);

  useEffect(() => () => player.dispose(), [player]);

  const play = (key: SoundKey) => {
    const { enabled, volume } = settings.sounds;

    if (enabled[SOUND_CATEGORY[key]]) {
      player.play(key, volume);
    }
  };

  const playLeaveSound = () => {
    const { enabled, volume } = settings.sounds;

    if (enabled.leave) {
      playLeave(volume);
    }
  };

  const hasLeftRef = useRef(false);
  const hasJoinedRef = useRef(false);

  const playOwnLeaveOnce = () => {
    if (hasLeftRef.current) {
      return;
    }

    hasLeftRef.current = true;

    if (isInvisible) {
      return;
    }

    playLeaveSound();
  };

  const playOwnJoinOnce = () => {
    if (hasJoinedRef.current) {
      return;
    }

    hasJoinedRef.current = true;

    if (isInvisible) {
      return;
    }

    play('join');
  };

  appEvents.on.pttHold(() => play('ptt'));
  appEvents.on.reaction(() => play('reaction'));
  appEvents.on.chatMessage(({ roomId: eventRoomId, senderId }) => {
    if (eventRoomId === roomId && senderId !== localParticipant.identity) {
      play('message');
    }
  });

  const prevDeafened = usePrevious(isDeafened);

  const playDeafenChange = useEffectEvent(() => {
    play(isDeafened ? 'deafen' : 'undeafen');
  });

  const playRoomEnter = useEffectEvent(() => {
    hasLeftRef.current = false;

    if (room.state === 'connected') {
      playOwnJoinOnce();
    }
  });

  const playRoomLeave = useEffectEvent(() => {
    hasJoinedRef.current = false;

    playOwnLeaveOnce();
  });

  useEffect(() => {
    if (prevDeafened !== undefined && prevDeafened !== isDeafened) {
      playDeafenChange();
    }
  }, [isDeafened, prevDeafened]);

  useEffect(() => {
    playRoomEnter();

    return () => playRoomLeave();
  }, [room]);

  useEmitterEvent(room, RoomEvent.Connected, () => playOwnJoinOnce());
  useEmitterEvent(room, RoomEvent.Reconnecting, () => play('reconnect'));
  useEmitterEvent(room, RoomEvent.SignalReconnecting, () => play('reconnect'));
  useEmitterEvent(room, RoomEvent.Disconnected, () => {
    hasJoinedRef.current = false;

    playOwnLeaveOnce();
  });
  useEmitterEvent(room, RoomEvent.ParticipantConnected, () => play('join'));
  useEmitterEvent(room, RoomEvent.ParticipantDisconnected, () => playLeaveSound());

  const onMicToggle =
    (key: Extract<SoundKey, 'mute' | 'unmute'>) => (publication: TrackPublication) => {
      if (publication.source === Track.Source.Microphone) {
        play(key);
      }
    };

  useEmitterEvent(localParticipant, ParticipantEvent.TrackMuted, onMicToggle('mute'));
  useEmitterEvent(localParticipant, ParticipantEvent.TrackUnmuted, onMicToggle('unmute'));
};
