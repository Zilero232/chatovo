import { BADGE_TIER_NAMES } from '@chatovo/schemas';
import { Separator } from '@chatovo/ui-kit';
import { useTranslations } from 'use-intl';

import { BadgeIcon } from '@/entities/app/badges';

import type { BadgeDetailProps } from './BadgeDetail.types';

import { getTierProgress } from '../../../lib/get-tier-progress';
import { BadgeProgressRow } from '../BadgeProgressRow/BadgeProgressRow';
import { BadgeTierLadder } from '../BadgeTierLadder/BadgeTierLadder';

import s from '../../BadgeCollection.module.scss';

export const BadgeDetail = ({ badge }: BadgeDetailProps) => {
  const t = useTranslations('badges');

  const { id, tier, value } = badge;
  const progress = getTierProgress({ id, value, tier });
  const title = tier > 0 ? t(`tiers.${BADGE_TIER_NAMES[tier - 1]}`) : t('notEarned');

  return (
    <div className={s.detail}>
      <BadgeIcon className={s.detailIcon} id={id} size='lg' tier={tier} />
      <h3 className={s.detailTitle}>{title}</h3>
      <span className={s.detailSubtitle}>
        {t(`items.${id}.name`)} · {t(`items.${id}.unit`, { count: value })}
      </span>

      <div className={s.progressCard}>
        <span className={s.progressTitle}>{t('progressTitle')}</span>
        <BadgeProgressRow id={id} progress={progress} tier={tier} />
        <Separator />
        <p className={s.progressHint}>{t(`items.${id}.hint`)}</p>
        <BadgeTierLadder id={id} tier={tier} />
      </div>
    </div>
  );
};
