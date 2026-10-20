'use client';

import { roomKindSchema } from '@chatovo/schemas';
import { useAudio } from '@siberiacancode/reactuse';
import { useState } from 'react';
import { sum, values } from 'remeda';

import { useAppSettings } from '@/entities/app/settings';
import { useCurrentUser } from '@/entities/auth/user';
import { useActiveVoiceRoomId } from '@/entities/room/session';
import { appEvents } from '@/shared/lib';

import type { UseFriendChatUnreadInput } from './use-friend-chat-unread.types';

const MESSAGE_SOUND_SRC = '/audios/ui/notification.mp3';

export const useFriendChatUnread = ({ openRoomId }: UseFriendChatUnreadInput) => {
  const { user } = useCurrentUser();
  const { settings } = useAppSettings();
  const messageAudio = useAudio(MESSAGE_SOUND_SRC, { interrupt: true });

  const [unreadByFriend, setUnreadByFriend] = useState<Record<string, number>>({});
  const activeVoiceRoomId = useActiveVoiceRoomId();

  const dmUnread = sum(values(unreadByFriend));

  const clearFriendUnread = (friendId: string) => {
    setUnreadByFriend((prev) => {
      if (!(friendId in prev)) {
        return prev;
      }

      const next = { ...prev };
      delete next[friendId];

      return next;
    });
  };

  const getFriendUnread = (friendId: string) => unreadByFriend[friendId] ?? 0;

  appEvents.on.chatMessage(({ roomId, senderId, roomKind }) => {
    if (
      roomKind !== roomKindSchema.enum.dm ||
      !senderId ||
      senderId === user?.id ||
      openRoomId === roomId ||
      activeVoiceRoomId === roomId
    ) {
      return;
    }

    setUnreadByFriend((prev) => ({
      ...prev,
      [senderId]: (prev[senderId] ?? 0) + 1
    }));

    if (!settings.sounds.enabled.message) {
      return;
    }

    messageAudio.setVolume(settings.sounds.volume);
    messageAudio.play();
  });

  return { dmUnread, getFriendUnread, clearFriendUnread };
};
