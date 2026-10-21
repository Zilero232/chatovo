import type { FriendshipRelation, UserBlockEntry } from '@chatovo/schemas';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { blockUser } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

import { addUserBlockEntry } from '../lib';
import { useInvalidateFriends } from './use-invalidate-friends';

export const useBlockUserMutation = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateFriends();

  return useMutation({
    mutationFn: (userId: string) => blockUser(userId),
    onSuccess: (entry, userId) => {
      queryClient.setQueryData<UserBlockEntry[]>(QUERY_KEYS.blockedUsers(), (entries) =>
        addUserBlockEntry({ entries, entry })
      );
      queryClient.setQueryData<FriendshipRelation>(QUERY_KEYS.friendshipRelation(userId), {
        status: 'blocked'
      });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.friendDmRoom(userId) });

      invalidate(userId);
    }
  });
};
