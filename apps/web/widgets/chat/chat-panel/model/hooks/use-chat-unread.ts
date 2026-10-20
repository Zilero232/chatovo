'use client';

import { useState } from 'react';

import { useCurrentUser } from '@/entities/auth/user';
import { appEvents } from '@/shared/lib';

export const useChatUnread = (roomId: string, isOpen: boolean) => {
  const { user } = useCurrentUser();

  const [unread, setUnread] = useState(0);
  const [seenOpen, setSeenOpen] = useState(isOpen);

  if (isOpen !== seenOpen) {
    setSeenOpen(isOpen);

    if (isOpen && unread !== 0) {
      setUnread(0);
    }
  }

  appEvents.on.chatMessage(({ roomId: eventRoomId, senderId }) => {
    if (eventRoomId !== roomId || isOpen || senderId === user?.id) {
      return;
    }

    setUnread((prev) => prev + 1);
  });

  return unread;
};
