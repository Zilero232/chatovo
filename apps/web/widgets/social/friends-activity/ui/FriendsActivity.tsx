'use client';

import { ScrollArea, Skeleton } from '@chatovo/ui-kit';
import { useTranslations } from 'next-intl';
import { isEmpty } from 'remeda';
import { match } from 'ts-pattern';

import { useRooms, useRoomsPresence } from '@/entities/room/room';
import { useFriends } from '@/entities/social/friend';

import type { FriendsActivityProps } from './FriendsActivity.types';

import { buildFriendActivity } from '../lib';
import { ActivityEmpty, ActivityOnline, ActivityRooms } from './components';

import s from './FriendsActivity.module.scss';

const ACTIVITY_SKELETON_KEYS = ['a', 'b'] as const;

export const FriendsActivity = ({ onNavigate }: FriendsActivityProps = {}) => {
  const t = useTranslations('channels.activity');

  const { data: friends, isPending } = useFriends();
  const { rooms } = useRooms();
  const presence = useRoomsPresence();

  const { inRooms, online } = buildFriendActivity({ friends: friends ?? [], presence, rooms });

  return (
    <aside className={s.root}>
      <p className={s.heading}>{t('heading')}</p>

      <ScrollArea className={s.scroll}>
        <div className={s.list}>
          {match({ isPending, hasActivity: !isEmpty(inRooms) || !isEmpty(online) })
            .with({ isPending: true }, () =>
              ACTIVITY_SKELETON_KEYS.map((key) => <Skeleton key={key} className={s.skeletonCard} />)
            )
            .with({ hasActivity: false }, () => <ActivityEmpty />)
            .otherwise(() => (
              <>
                {!isEmpty(inRooms) && <ActivityRooms groups={inRooms} onNavigate={onNavigate} />}
                {!isEmpty(online) && <ActivityOnline entries={online} />}
              </>
            ))}
        </div>
      </ScrollArea>
    </aside>
  );
};
