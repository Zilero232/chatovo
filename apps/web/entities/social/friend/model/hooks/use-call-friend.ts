'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getOutgoingFriendCall, ringFriendCall } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export type CallFriendInput = {
  userId: string;
};

export const useCallFriend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: CallFriendInput) => ringFriendCall(userId),
    onSuccess: async () => {
      const outgoing = await getOutgoingFriendCall();
      queryClient.setQueryData(QUERY_KEYS.friendCallOutgoing(), outgoing);
    }
  });
};
