'use client';

import { useMutation } from '@tanstack/react-query';

import { declineFriendRequest } from '@/shared/api';

import { useInvalidateFriends } from './use-invalidate-friends';

export const useDeclineFriendRequest = () => {
  const invalidate = useInvalidateFriends();

  return useMutation({
    mutationFn: (args: { friendshipId: string; userId: string }) =>
      declineFriendRequest(args.friendshipId),
    onSuccess: (_data, args) => {
      invalidate(args.userId);
    }
  });
};
