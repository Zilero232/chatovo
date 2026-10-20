'use client';

import type { FriendUser } from '@chatovo/schemas';

import { useState } from 'react';

import { useFriends } from '@/entities/social/friend';
import { useFriendChat } from '@/features/social/friend-chat';

import type { RemoveTarget } from '../../types';

type UseFriendsListParams = {
  onlyOnline: boolean;
  query: string;
};

export const useFriendsList = ({ query, onlyOnline }: UseFriendsListParams) => {
  const { data, isPending } = useFriends();
  const { open: openFriendChat, getFriendUnread } = useFriendChat();

  const [removeTarget, setRemoveTarget] = useState<RemoveTarget | null>(null);

  const search = query.trim().toLowerCase();

  const requestRemove = (user: FriendUser) => {
    setRemoveTarget({ userId: user.id, friendName: user.name });
  };

  const clearRemoveTarget = () => setRemoveTarget(null);

  return {
    isPending,
    search,
    removeTarget,
    getFriendUnread,
    friends: (data ?? [])
      .filter((entry) => !onlyOnline || entry.user.isOnline)
      .filter((entry) => !search || entry.user.name.toLowerCase().includes(search)),
    openFriendChat,
    requestRemove,
    clearRemoveTarget
  };
};
