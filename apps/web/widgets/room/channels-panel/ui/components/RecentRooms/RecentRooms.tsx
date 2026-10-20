'use client';

import { Skeleton } from '@chatovo/ui-kit';
import { Clock, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { isEmpty } from 'remeda';

import type { RecentRoomsProps } from './RecentRooms.types';

import { useRecentRoomsList } from '../../../model/hooks';

import s from './RecentRooms.module.scss';

export const RecentRooms = ({ onNavigate, variant = 'list' }: RecentRoomsProps = {}) => {
  const t = useTranslations('lobby.recent');

  const { recent, entries, isLoading, isLive, navigate } = useRecentRoomsList({ onNavigate });

  const isStrip = variant === 'strip';

  if (isLoading && !isEmpty(recent)) {
    return (
      <div className={isStrip ? s.rootStrip : s.root}>
        <h4 className={isStrip ? s.headingStrip : s.heading}>
          <Clock className={s.headingIcon} />
          {t('heading')}
        </h4>

        <div className={isStrip ? s.strip : s.list}>
          {recent.map((entry) => (
            <Skeleton key={entry.id} className={isStrip ? s.stripItemSkeleton : s.itemSkeleton} />
          ))}
        </div>
      </div>
    );
  }

  if (isEmpty(entries)) {
    return null;
  }

  return (
    <div className={isStrip ? s.rootStrip : s.root}>
      <h4 className={isStrip ? s.headingStrip : s.heading}>
        <Clock className={s.headingIcon} />
        {t('heading')}
      </h4>

      <div className={isStrip ? s.strip : s.list}>
        {entries.map((room) => (
          <button
            key={room.id}
            className={isStrip ? s.stripItem : s.item}
            data-live={isLive(room.id)}
            type='button'
            onClick={() => navigate(room.id)}
          >
            <span aria-hidden className={isLive(room.id) ? s.dotLive : s.dot} />
            <span className={isStrip ? s.stripName : s.name}>{room.name}</span>
            {room.isPrivate && (
              <>
                <Lock aria-hidden className={s.lockIcon} />
                <span className='sr-only'>{t('privateRoom')}</span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
