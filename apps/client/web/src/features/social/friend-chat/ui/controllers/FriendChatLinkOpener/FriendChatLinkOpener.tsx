import type { FriendUser } from '@chatovo/schemas';

import { FRIEND_CHAT_QUERY_PARAM } from '@chatovo/schemas';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useEffectEvent } from 'react';

import { useFriends } from '@/entities/social/friend';
import { ROUTES } from '@/shared/constants';

import { useFriendChat } from '../../../model/contexts';

export const FriendChatLinkOpener = () => {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });

  const { open } = useFriendChat();
  const friendId = search[FRIEND_CHAT_QUERY_PARAM];
  const { data: friends } = useFriends(Boolean(friendId));

  const openFromLink = useEffectEvent((friend: FriendUser | undefined) => {
    if (friend) {
      open(friend);
    }

    navigate({ to: ROUTES.lobby, replace: true });
  });

  useEffect(() => {
    if (!friendId || !friends) {
      return;
    }

    openFromLink(friends.find((entry) => entry.user.id === friendId)?.user);
  }, [friendId, friends]);

  return null;
};
