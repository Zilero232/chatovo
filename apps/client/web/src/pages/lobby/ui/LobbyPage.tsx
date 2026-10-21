import { useMediaQuery } from '@siberiacancode/reactuse';
import { Suspense } from 'react';
import { match, P } from 'ts-pattern';

import { GooglePlayPromo } from '@/features/app/google-play-promo';
import { FriendChatLinkOpener, useFriendChat } from '@/features/social/friend-chat';
import { MEDIA_QUERIES } from '@/shared/constants';
import { FriendChatPanel } from '@/widgets/social/friend-chat-panel';
import { FriendsActivity } from '@/widgets/social/friends-activity';
import { FriendsPanel } from '@/widgets/social/friends-panel';

import { LobbySections } from './components/LobbySections/LobbySections';

import s from './LobbyPage.module.scss';

export const LobbyPage = () => {
  const { session, openingPeer } = useFriendChat();
  const isDesktop = useMediaQuery(MEDIA_QUERIES.desktop);

  const peer = session?.peer ?? openingPeer;

  return (
    <div className={s.root}>
      <Suspense fallback={null}>
        <FriendChatLinkOpener />
      </Suspense>

      <div className={s.main}>
        {match([peer, isDesktop] as const)
          .with([P.nonNullable, P._], ([chatPeer]) => <FriendChatPanel peer={chatPeer} />)
          .with([P.nullish, true], () => (
            <>
              <GooglePlayPromo />
              <FriendsPanel />
            </>
          ))
          .with([P.nullish, false], () => (
            <>
              <GooglePlayPromo />
              <LobbySections />
            </>
          ))
          .exhaustive()}
      </div>

      <div className={s.aside}>
        <FriendsActivity />
      </div>
    </div>
  );
};
