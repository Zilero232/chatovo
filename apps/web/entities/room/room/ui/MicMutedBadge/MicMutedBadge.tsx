'use client';

import { MicOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { MicMutedBadgeProps } from './MicMutedBadge.types';

import { AvatarStatusDot } from '../AvatarStatusDot/AvatarStatusDot';

export const MicMutedBadge = ({ className }: MicMutedBadgeProps) => {
  const t = useTranslations('lobby.card');

  return (
    <AvatarStatusDot
      className={className}
      corner='bottom-right'
      icon={MicOff}
      label={t('micMuted')}
      tone='danger'
    />
  );
};
