'use client';

import { Badge } from '@chatovo/ui-kit';
import { useTranslations } from 'next-intl';

import type { UserBadgesProps } from './UserBadges.types';

export const UserBadges = ({ user }: UserBadgesProps) => {
  const t = useTranslations('admin');

  return (
    <>
      {user.online && <Badge tone='primary'>{t('users.online')}</Badge>}
      {user.role === 'admin' && <Badge tone='primary'>{t('users.admin')}</Badge>}
      {user.verified && <Badge>{t('users.verified')}</Badge>}
      {user.blockedAt && <Badge tone='danger'>{t('users.blocked')}</Badge>}
    </>
  );
};
