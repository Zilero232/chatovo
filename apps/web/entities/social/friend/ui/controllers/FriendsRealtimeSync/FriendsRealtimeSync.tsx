'use client';

import { useQueryClient } from '@tanstack/react-query';
import { match } from 'ts-pattern';

import { useRealtimeMessage } from '@/entities/app/realtime';

import { applyFriendPresence, applyFriendsSnapshot } from '../../../model/lib';

export const FriendsRealtimeSync = () => {
  const queryClient = useQueryClient();

  useRealtimeMessage((message) => {
    match(message)
      .with({ type: 'friend.presence' }, ({ userId, isOnline }) => {
        applyFriendPresence(queryClient, userId, isOnline);
      })
      .with({ type: 'friends.snapshot' }, ({ snapshot }) => {
        applyFriendsSnapshot({ queryClient, snapshot });
      })
      .otherwise(() => {});
  });

  return null;
};
