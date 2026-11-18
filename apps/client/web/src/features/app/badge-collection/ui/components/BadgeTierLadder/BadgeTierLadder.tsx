import { BADGE_TIER_NAMES, BADGE_TIERS } from '@chatovo/schemas';
import { clsx } from 'clsx';
import { Lock } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { BadgeIcon } from '@/entities/app/badges';

import type { BadgeTierLadderProps } from './BadgeTierLadder.types';

import s from '../../BadgeCollection.module.scss';

export const BadgeTierLadder = ({ id, tier }: BadgeTierLadderProps) => {
  const t = useTranslations('badges');

  return (
    <ol className={s.ladder}>
      {BADGE_TIERS[id].map((threshold, index) => {
        const step = index + 1;
        const isLocked = step > tier;

        return (
          <li
            key={threshold}
            className={clsx(s.ladderStep, {
              [s.ladderLocked]: isLocked,
              [s.ladderCurrent]: step === tier
            })}
          >
            <BadgeIcon id={id} tier={step} />
            <span className={s.ladderName}>{t(`tiers.${BADGE_TIER_NAMES[index]}`)}</span>
            <span className={s.ladderGoal}>
              {isLocked && <Lock aria-hidden />}
              {t(`items.${id}.unit`, { count: threshold })}
            </span>
          </li>
        );
      })}
    </ol>
  );
};
