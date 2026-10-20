import type { MouseEvent } from 'react';

import { Tooltip, TooltipContent } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { BadgeCheck } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { handleExternalLinkClick } from '@/shared/lib';

import type { UserNameProps } from './UserName.types';

import { DeveloperBadge } from '../DeveloperBadge/DeveloperBadge';

import s from './UserName.module.scss';

const checkSizeClass = {
  sm: s.checkSm,
  md: s.checkMd
} as const;

export const UserName = ({
  className,
  developer = false,
  name,
  profileUrl = null,
  size = 'sm',
  verified = false
}: UserNameProps) => {
  const t = useTranslations('user');

  const check = verified ? (
    <Tooltip>
      <span aria-label={t('verified')} className={s.checkWrap} role='img'>
        <BadgeCheck className={clsx(s.check, checkSizeClass[size])} />
      </span>
      <TooltipContent sideOffset={6}>{t('verified')}</TooltipContent>
    </Tooltip>
  ) : null;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
    handleExternalLinkClick({ event, url: profileUrl });
  };

  return (
    <span className={clsx(s.root, className)}>
      {profileUrl ? (
        <a
          className={clsx(s.link, developer && s.developerName)}
          href={profileUrl}
          rel='noreferrer noopener'
          target='_blank'
          onClick={handleClick}
        >
          {name}
        </a>
      ) : (
        <span className={clsx(s.text, developer && s.developerName)}>{name}</span>
      )}
      {check}
      {developer && <DeveloperBadge size={size} />}
    </span>
  );
};
