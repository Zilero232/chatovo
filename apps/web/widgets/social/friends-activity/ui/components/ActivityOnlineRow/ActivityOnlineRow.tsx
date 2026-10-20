'use client';

import { UserAvatar, UserName } from '@/entities/auth/user';

import type { ActivityOnlineRowProps } from './ActivityOnlineRow.types';

import s from './ActivityOnlineRow.module.scss';

export const ActivityOnlineRow = ({ user }: ActivityOnlineRowProps) => (
  <div className={s.root}>
    <span className={s.avatarSlot}>
      <UserAvatar
        className={s.avatar}
        fallbackClassName={s.avatarFallback}
        name={user.name}
        src={user.avatarUrl}
      />
      <span aria-hidden className={s.dot} />
    </span>

    <UserName
      className={s.name}
      developer={user.developer}
      name={user.name}
      verified={user.verified}
    />
  </div>
);
