'use client';

import { useMutation } from '@tanstack/react-query';

import { acceptFriendRequest } from '@/shared/api';

import { useInvalidateFriends } from './use-invalidate-friends';

export const useAcceptFriendRequest = () => {
  const invalidate = useInvalidateFriends();

  return useMutation({
    mutationFn: (args: { friendshipId: string; userId: string }) =>
      acceptFriendRequest(args.friendshipId),
    onSuccess: (_data, args) => {
      invalidate(args.userId);
    }
  });
};
