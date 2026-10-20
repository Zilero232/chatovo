import { clsx } from 'clsx';
import { EyeOff, Music, ScreenShare } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { ParticipantBadgesProps } from './ParticipantBadges.types';

import s from '../../ParticipantCard.module.scss';

export const ParticipantBadges = ({ hasMusic, hasScreen, invisible }: ParticipantBadgesProps) => {
  const t = useTranslations('room');

  if (!hasMusic && !hasScreen && !invisible) {
    return null;
  }

  return (
    <div className={s.badges}>
      {invisible && (
        <span className={clsx(s.badge, s.badgeInvisible)}>
          <EyeOff className={s.badgeIcon} />
          {t('invisibleBadge')}
        </span>
      )}
      {hasScreen && (
        <span className={s.badge}>
          <ScreenShare className={s.badgeIcon} />
          {t('badges.screen')}
        </span>
      )}
      {hasMusic && (
        <span className={s.badge}>
          <Music className={s.badgeIcon} />
          {t('badges.music')}
        </span>
      )}
    </div>
  );
};
