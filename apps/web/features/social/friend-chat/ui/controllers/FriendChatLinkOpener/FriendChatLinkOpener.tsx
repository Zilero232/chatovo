'use client';

import type { FriendUser } from '@chatovo/schemas';

import { FRIEND_CHAT_QUERY_PARAM } from '@chatovo/schemas';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useEffectEvent } from 'react';

import { useFriends } from '@/entities/social/friend';
import { ROUTES } from '@/shared/constants';

import { useFriendChat } from '../../../model/contexts';

export const FriendChatLinkOpener = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { open } = useFriendChat();
  const friendId = searchParams.get(FRIEND_CHAT_QUERY_PARAM);
  const { data: friends } = useFriends(Boolean(friendId));

  const openFromLink = useEffectEvent((friend: FriendUser | undefined) => {
    if (friend) {
      open(friend);
    }

    router.replace(ROUTES.lobby);
  });

  useEffect(() => {
    if (!friendId || !friends) {
      return;
    }

    openFromLink(friends.find((entry) => entry.user.id === friendId)?.user);
  }, [friendId, friends]);

  return null;
};
