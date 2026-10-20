'use client';

import { clsx } from 'clsx';
import { Crown, Headphones, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { ManageRoomMenu } from '@/features/room/manage';
import { buildRoomHref } from '@/shared/lib';

import type { RoomItemTriggerProps } from './RoomItemTrigger.types';

import s from '../../ChannelsRoomItem.module.scss';

export const RoomItemTrigger = ({ isActive, isOwner, room, onNavigate }: RoomItemTriggerProps) => {
  const t = useTranslations('channels');
  const router = useRouter();

  const handleClick = () => {
    router.push(buildRoomHref(room.id));
    onNavigate?.();
  };

  return (
    <div className={s.row}>
      <button
        className={clsx(s.trigger, {
          [s.triggerActive]: isActive,
          [s.triggerOwner]: isOwner
        })}
        type='button'
        onClick={handleClick}
      >
        <span className={s.triggerLabel}>
          <span className={s.triggerName}>{room.name}</span>
          {room.isPrivate && (
            <>
              <Lock aria-hidden className={s.privateIcon} />
              <span className='sr-only'>{t('privateRoom')}</span>
            </>
          )}
          {isOwner && <Crown aria-hidden className={s.ownerIcon} />}
        </span>
        {isActive && <Headphones aria-hidden className={s.joinedIcon} />}
      </button>
      <ManageRoomMenu className={s.manageSlot} room={room} />
    </div>
  );
};
