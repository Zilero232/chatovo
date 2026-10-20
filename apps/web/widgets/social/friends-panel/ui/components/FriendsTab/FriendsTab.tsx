'use client';

import type { FriendEntry } from '@chatovo/schemas';

import { CenteredState, Spinner } from '@chatovo/ui-kit';
import { useTranslations } from 'next-intl';
import { isEmpty } from 'remeda';
import { match, P } from 'ts-pattern';

import { RemoveFriendConfirmDialog } from '@/features/social/remove-friend';

import type { FriendsTabProps } from './FriendsTab.types';

import { useFriendsList } from '../../../model/hooks';
import { FriendsList } from '../FriendsList/FriendsList';

import s from '../../FriendsPanel.module.scss';

const hasFriends = (friends: FriendEntry[]): friends is [FriendEntry, ...FriendEntry[]] =>
  !isEmpty(friends);

export const FriendsTab = ({ countLabel, query, onlyOnline = false }: FriendsTabProps) => {
  const t = useTranslations('friends');

  const {
    friends,
    isPending,
    search,
    removeTarget,
    getFriendUnread,
    openFriendChat,
    requestRemove,
    clearRemoveTarget
  } = useFriendsList({ query, onlyOnline });

  return (
    <>
      {match({ isPending, friends })
        .with({ isPending: true }, () => <Spinner className={s.spinner} />)
        .with({ friends: P.when(hasFriends) }, ({ friends: items }) => (
          <FriendsList
            countLabel={countLabel}
            getUnread={getFriendUnread}
            items={items}
            onOpen={openFriendChat}
            onRemove={requestRemove}
          />
        ))
        .with({ friends: P.when(() => Boolean(search)) }, () => (
          <CenteredState
            className={s.empty}
            description={t('nothingFoundHint')}
            pattern='dots'
            size='sm'
            title={t('nothingFound')}
          />
        ))
        .otherwise(() => (
          <CenteredState
            className={s.empty}
            description={t('emptyFriendsHint')}
            pattern='dots'
            size='sm'
            title={t(onlyOnline ? 'emptyOnlineTitle' : 'emptyFriendsTitle')}
          />
        ))}

      {removeTarget && (
        <RemoveFriendConfirmDialog
          friendName={removeTarget.friendName}
          open={Boolean(removeTarget)}
          userId={removeTarget.userId}
          onOpenChange={(open) => {
            if (!open) {
              clearRemoveTarget();
            }
          }}
        />
      )}
    </>
  );
};
