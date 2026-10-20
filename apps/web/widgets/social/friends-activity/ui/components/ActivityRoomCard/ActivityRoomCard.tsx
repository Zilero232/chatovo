'use client';

import { clsx } from 'clsx';
import { Mic, MicOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { UserAvatar } from '@/entities/auth/user';
import { buildRoomHref } from '@/shared/lib';

import type { ActivityRoomCardProps } from './ActivityRoomCard.types';

import s from './ActivityRoomCard.module.scss';

export const ActivityRoomCard = ({ group, onNavigate }: ActivityRoomCardProps) => {
  const t = useTranslations('channels.activity');
  const router = useRouter();

  const { friends, roomId, roomName, totalInRoom } = group;
  const others = totalInRoom - friends.length;

  const handleClick = () => {
    router.push(buildRoomHref(roomId));
    onNavigate?.();
  };

  return (
    <button className={s.root} type='button' onClick={handleClick}>
      <span className={s.head}>
        <span aria-hidden className={s.pulse} />
        <span className={s.roomName}>{roomName}</span>
        <span className={s.join}>{t('join')}</span>
      </span>

      <span className={s.people}>
        {friends.map((friend) => (
          <span key={friend.friendshipId} className={s.person}>
            <span className={s.avatarSlot}>
              <UserAvatar
                className={s.avatar}
                fallbackClassName={s.avatarFallback}
                name={friend.user.name}
                src={friend.user.avatarUrl}
              />
              <span className={clsx(s.micDot, { [s.micDotLive]: friend.isLive })}>
                {friend.isLive ? <Mic className={s.micIcon} /> : <MicOff className={s.micIcon} />}
              </span>
            </span>
            <span className={s.personName}>{friend.user.name}</span>
          </span>
        ))}
      </span>

      {others > 0 && <span className={s.others}>{t('others', { count: others })}</span>}
    </button>
  );
};
