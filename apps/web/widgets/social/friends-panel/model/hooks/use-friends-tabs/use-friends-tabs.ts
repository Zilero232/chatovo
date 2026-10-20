'use client';

import { useState } from 'react';

import { useFriends, useIncomingFriendRequests } from '@/entities/social/friend';
import { useFriendChat } from '@/features/social/friend-chat';

export const useFriendsTabs = () => {
  const { data: friends } = useFriends();
  const { data: requests } = useIncomingFriendRequests();

  const { friendsTab, setFriendsTab } = useFriendChat();

  const [query, setQuery] = useState('');

  return {
    friendsTab,
    query,
    friendsCount: friends?.length ?? 0,
    incomingCount: requests?.length ?? 0,
    onlineCount: (friends ?? []).filter((entry) => entry.user.isOnline).length,
    setFriendsTab,
    setQuery
  };
};
