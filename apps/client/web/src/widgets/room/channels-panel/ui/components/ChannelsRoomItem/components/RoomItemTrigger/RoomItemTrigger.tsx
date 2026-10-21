import { useNavigate } from '@tanstack/react-router';
import { clsx } from 'clsx';
import { Crown, Headphones, Lock, Volume2 } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { ManageRoomMenu } from '@/features/room/manage';
import { ROUTES } from '@/shared/constants';
import { buildRoomSearch } from '@/shared/lib';

import type { RoomItemTriggerProps } from './RoomItemTrigger.types';

import s from '../../ChannelsRoomItem.module.scss';

export const RoomItemTrigger = ({ isActive, isOwner, room, onNavigate }: RoomItemTriggerProps) => {
  const t = useTranslations('channels');
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: ROUTES.room, search: buildRoomSearch(room.id) });
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
          <Volume2 aria-hidden className={s.roomIcon} />
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
