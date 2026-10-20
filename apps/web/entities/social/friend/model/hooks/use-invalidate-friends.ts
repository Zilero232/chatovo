import { useQueryClient } from '@tanstack/react-query';

import { invalidateFriendsQueries } from '../lib';

export const useInvalidateFriends = () => {
  const queryClient = useQueryClient();

  return (userId?: string) => {
    invalidateFriendsQueries(queryClient, userId);
  };
};
