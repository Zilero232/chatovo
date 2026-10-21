import { useQueryClient } from '@tanstack/react-query';
import { match } from 'ts-pattern';

import { useRealtimeMessage } from '@/entities/app/realtime';

import { useBlockedUsers } from '../../../model/hooks';
import { applyFriendPresence, applyFriendsSnapshot } from '../../../model/lib';

export const FriendsRealtimeSync = () => {
  const queryClient = useQueryClient();

  useBlockedUsers();

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
