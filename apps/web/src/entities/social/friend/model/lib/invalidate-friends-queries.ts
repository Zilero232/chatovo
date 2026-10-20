import type { QueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

export const invalidateFriendsQueries = (queryClient: QueryClient, userId?: string) => {
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.friends() });
  queryClient.invalidateQueries({ queryKey: QUERY_KEYS.friendRequestsIncoming() });
  queryClient.invalidateQueries({ queryKey: ['friend-by-tag'] });
  queryClient.invalidateQueries({
    queryKey: userId ? QUERY_KEYS.friendshipRelation(userId) : QUERY_KEYS.friendshipRelations()
  });
};
