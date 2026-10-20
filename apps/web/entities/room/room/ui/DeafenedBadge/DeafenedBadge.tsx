'use client';

import { HeadphoneOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { DeafenedBadgeProps } from './DeafenedBadge.types';

import { AvatarStatusDot } from '../AvatarStatusDot/AvatarStatusDot';

export const DeafenedBadge = ({ className }: DeafenedBadgeProps) => {
  const t = useTranslations('lobby.card');

  return (
    <AvatarStatusDot
      className={className}
      corner='bottom-left'
      icon={HeadphoneOff}
      label={t('deafened')}
      tone='danger'
    />
  );
};
