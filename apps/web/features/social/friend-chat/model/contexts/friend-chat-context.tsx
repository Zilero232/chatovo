'use client';

import type { ReactNode } from 'react';

import { createContextHook } from '@siberiacancode/reactuse';
import { useEffect, useEffectEvent, useState } from 'react';

import type { FriendsTabValue } from '../types';

import { useFriendChatSession, useFriendChatUnread } from '../hooks';

const useFriendChatState = () => {
  const { session, openingPeer, isOpening, open, close } = useFriendChatSession();

  const [friendsTab, setFriendsTab] = useState<FriendsTabValue>('online');

  const { dmUnread, getFriendUnread, clearFriendUnread } = useFriendChatUnread({
    openRoomId: session?.roomId ?? null
  });

  const clearPeerUnread = useEffectEvent((friendId: string) => {
    clearFriendUnread(friendId);
  });

  useEffect(() => {
    if (session?.peer.id) {
      clearPeerUnread(session.peer.id);
    }
  }, [session?.peer.id]);

  return {
    session,
    openingPeer,
    isOpening,
    dmUnread,
    friendsTab,
    getFriendUnread,
    open,
    close,
    setFriendsTab
  };
};

const { Provider, use } = createContextHook(useFriendChatState);

export const FriendChatProvider = ({ children }: { children: ReactNode }) => (
  <Provider params={[]}>{children}</Provider>
);

export const useFriendChat = () => {
  const value = use();

  if (!value) {
    throw new Error('useFriendChat must be used within FriendChatProvider');
  }

  return value;
};
