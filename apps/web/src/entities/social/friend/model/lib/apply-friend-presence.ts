import type { FriendEntry } from '@chatovo/schemas';
import type { QueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

export const applyFriendPresence = (
  queryClient: QueryClient,
  userId: string,
  isOnline: boolean
) => {
  queryClient.setQueryData<FriendEntry[]>(QUERY_KEYS.friends(), (entries) => {
    if (!entries) {
      return entries;
    }

    return entries.map((entry) => {
      if (entry.user.id !== userId) {
        return entry;
      }

      return { ...entry, user: { ...entry.user, isOnline } };
    });
  });
};
