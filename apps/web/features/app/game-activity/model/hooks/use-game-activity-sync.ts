'use client';

import { useConnectionState, useRoomContext } from '@livekit/components-react';
import { ConnectionState } from 'livekit-client';
import { useEffect } from 'react';

import { useRealtime } from '@/entities/app/realtime';
import { useCurrentUser } from '@/entities/auth/user';
import { useRoomParticipants } from '@/entities/room/room';

import { useGameActivity } from './use-game-activity';

export const useGameActivitySync = () => {
  const room = useRoomContext();
  const connectionState = useConnectionState();

  const { send } = useRealtime();
  const { user } = useCurrentUser();

  const activity = useGameActivity();
  const participants = useRoomParticipants(room.name);

  const roomId = room.name;
  const isConnected = connectionState === ConnectionState.Connected;
  const isPresent = participants.some((participant) => participant.identity === user?.id);

  useEffect(() => {
    if (!roomId || !isConnected || !isPresent) {
      return;
    }

    send({ op: 'presence.patch', roomId, activity });
    // eslint-disable-next-line react/exhaustive-deps -- republish once presence exists and whenever the detected activity changes; send is stable
  }, [activity, roomId, isConnected, isPresent]);
};
