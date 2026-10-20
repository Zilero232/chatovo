import { clsx } from 'clsx';
import { EyeOff } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { UserAvatar, UserName } from '@/entities/auth/user';

import type { InvisibleParticipantCardProps } from './InvisibleParticipantCard.types';

import s from './InvisibleParticipantCard.module.scss';

export const InvisibleParticipantCard = ({
  participant,
  fill = false
}: InvisibleParticipantCardProps) => {
  const t = useTranslations('room');

  const { name, avatarUrl, verified, developer } = participant;

  return (
    <div className={clsx(s.root, { [s.rootFill]: fill })}>
      <div className={s.stage}>
        <UserAvatar
          className={s.avatar}
          fallbackClassName={s.avatarFallback}
          name={name}
          sizes='256px'
          src={avatarUrl}
        />
      </div>

      <div className={s.badges}>
        <span className={s.badge}>
          <EyeOff className={s.badgeIcon} />
          {t('invisibleBadge')}
        </span>
      </div>

      <div className={s.metadata}>
        <UserName className={s.name} developer={developer} name={name} verified={verified} />
      </div>
    </div>
  );
};
