'use client';

import { Crown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { OwnerCrownProps } from './OwnerCrown.types';

import { AvatarStatusDot } from '../AvatarStatusDot/AvatarStatusDot';

export const OwnerCrown = ({ className }: OwnerCrownProps) => {
  const t = useTranslations('lobby.card');

  return (
    <AvatarStatusDot
      className={className}
      corner='top-left'
      icon={Crown}
      label={t('ownerTooltip')}
      tone='gold'
    />
  );
};
