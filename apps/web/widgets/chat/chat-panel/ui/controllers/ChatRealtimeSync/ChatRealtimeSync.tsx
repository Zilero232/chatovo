'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { useRealtime, useRealtimeMessage } from '@/entities/app/realtime';
import { QUERY_KEYS } from '@/shared/constants';

import { applyChatRealtime } from '../../../model/lib';

export const ChatRealtimeSync = () => {
  const queryClient = useQueryClient();
  const { isConnected } = useRealtime();

  const wasDisconnectedRef = useRef(false);

  useRealtimeMessage((message) => {
    applyChatRealtime(queryClient, message);
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

    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chatMessagesRoot() });
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rooms() });
  }, [isConnected, queryClient]);

  return null;
};
