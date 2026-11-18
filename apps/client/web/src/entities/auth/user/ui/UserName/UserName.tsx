import type { CSSProperties, MouseEvent } from 'react';

import { Tooltip, TooltipContent } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { BadgeCheck } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { handleExternalLinkClick, toLinearGradient } from '@/shared/lib';

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
  gradient = null,
  gradientAnimated = false,
  name,
  profileUrl = null,
  size = 'sm',
  verified = false
}: UserNameProps) => {
  const t = useTranslations('user');

  const nameClassName = clsx({
    [s.developerName]: developer && !gradient,
    [s.styledName]: gradient,
    [s.styledNameAnimated]: gradient && gradientAnimated
  });
  const nameStyle = gradient
    ? ({
        '--name-gradient': toLinearGradient({
          colors: gradient,
          angle: 90,
          repeat: gradientAnimated
        })
      } as CSSProperties)
    : undefined;

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
          className={clsx(s.link, nameClassName)}
          href={profileUrl}
          rel='noreferrer noopener'
          style={nameStyle}
          target='_blank'
          onClick={handleClick}
        >
          {name}
        </a>
      ) : (
        <span className={clsx(s.text, nameClassName)} style={nameStyle}>
          {name}
        </span>
      )}
      {check}
      {developer && <DeveloperBadge size={size} />}
    </span>
  );
};
