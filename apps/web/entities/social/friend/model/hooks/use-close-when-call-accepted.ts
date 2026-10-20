'use client';

import { useRunWhen } from '@/shared/hooks';

import { useOutgoingFriendCall } from './use-outgoing-friend-call';

export const useCloseWhenCallAccepted = (close: () => void) => {
  const { data } = useOutgoingFriendCall();

  useRunWhen(data?.call?.status === 'accepted', close);
};
