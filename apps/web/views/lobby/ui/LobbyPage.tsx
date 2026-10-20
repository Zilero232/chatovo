'use client';

import { Suspense } from 'react';

import { GooglePlayPromo } from '@/features/app/google-play-promo';
import { FriendChatLinkOpener, useFriendChat } from '@/features/social/friend-chat';
import { FriendChatPanel } from '@/widgets/social/friend-chat-panel';
import { FriendsActivity } from '@/widgets/social/friends-activity';
import { FriendsPanel } from '@/widgets/social/friends-panel';

import s from './LobbyPage.module.scss';

export const LobbyPage = () => {
  const { session, openingPeer } = useFriendChat();

  const peer = session?.peer ?? openingPeer;

  return (
    <div className={s.root}>
      <Suspense fallback={null}>
        <FriendChatLinkOpener />
      </Suspense>

      <div className={s.main}>
        {peer ? (
          <FriendChatPanel peer={peer} />
        ) : (
          <>
            <GooglePlayPromo />
            <FriendsPanel />
          </>
        )}
      </div>

      <div className={s.aside}>
        <FriendsActivity />
      </div>
    </div>
  );
};
