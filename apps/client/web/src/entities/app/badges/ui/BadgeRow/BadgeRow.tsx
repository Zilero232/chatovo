import { Tooltip, TooltipContent } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { useTranslations } from 'use-intl';

import type { BadgeRowProps } from './BadgeRow.types';

import { useUserBadges } from '../../model/hooks';
import { BadgeIcon } from '../BadgeIcon/BadgeIcon';

import s from './BadgeRow.module.scss';

export const BadgeRow = ({ userId, className }: BadgeRowProps) => {
  const t = useTranslations('badges');

  const { data: badges } = useUserBadges(userId);

  if (!badges || badges.length === 0) {
    return null;
  }

  return (
    <span className={clsx(s.root, className)}>
      {badges.map(({ id, tier }) => (
        <Tooltip key={id}>
          <span aria-label={t(`items.${id}.name`)} className={s.item} role='img'>
            <BadgeIcon id={id} size='sm' tier={tier} />
          </span>
          <TooltipContent sideOffset={6}>
            {t(`items.${id}.name`)} · {t('tier', { tier })}
          </TooltipContent>
        </Tooltip>
      ))}
    </span>
  );
};
