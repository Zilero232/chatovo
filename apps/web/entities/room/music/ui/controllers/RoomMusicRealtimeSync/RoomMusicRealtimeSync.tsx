'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { match } from 'ts-pattern';

import { useRealtime, useRealtimeMessage } from '@/entities/app/realtime';
import { QUERY_KEYS } from '@/shared/constants';

import { writeRoomMusicCache } from '../../../lib';

export const RoomMusicRealtimeSync = () => {
  const queryClient = useQueryClient();
  const { isConnected } = useRealtime();

  const wasDisconnectedRef = useRef(false);

  useRealtimeMessage((message) => {
    match(message)
      .with({ type: 'room.music' }, ({ music }) => {
        writeRoomMusicCache({ queryClient, music });
      })
      .otherwise(() => {});
  });

  useEffect(() => {
    if (!isConnected) {
      wasDisconnectedRef.current = true;

      return;
    }

    if (!wasDisconnectedRef.current) {
      return;
    }

    wasDisconnectedRef.current = false;

    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roomMusicRoot() });
  }, [isConnected, queryClient]);

  return null;
};
