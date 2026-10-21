import type { FriendshipRelation, UserBlockEntry } from '@chatovo/schemas';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { unblockUser } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

import { removeUserBlockEntry } from '../lib';
import { useInvalidateFriends } from './use-invalidate-friends';

export const useUnblockUserMutation = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateFriends();

  return useMutation({
    mutationFn: (userId: string) => unblockUser(userId),
    onSuccess: (_data, userId) => {
      queryClient.setQueryData<UserBlockEntry[]>(QUERY_KEYS.blockedUsers(), (entries) =>
        removeUserBlockEntry({ entries, userId })
      );
      queryClient.setQueryData<FriendshipRelation>(QUERY_KEYS.friendshipRelation(userId), {
        status: 'none'
      });

      invalidate(userId);
    }
  });
};
