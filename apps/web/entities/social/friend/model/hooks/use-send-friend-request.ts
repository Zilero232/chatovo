'use client';

import type { SendFriendRequestInput } from '@chatovo/schemas';

import { useMutation } from '@tanstack/react-query';

import { sendFriendRequest } from '@/shared/api';

import { useInvalidateFriends } from './use-invalidate-friends';

type SendFriendRequestVariables = SendFriendRequestInput & {
  relationUserId?: string;
};

export const useSendFriendRequest = () => {
  const invalidate = useInvalidateFriends();

  return useMutation({
    mutationFn: ({ tag }: SendFriendRequestVariables) => sendFriendRequest({ tag }),
    onSuccess: (_data, { relationUserId }) => {
      invalidate(relationUserId);
    }
  });
};
