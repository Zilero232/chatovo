import { isStaffRole } from '@chatovo/schemas';
import { Badge } from '@chatovo/ui-kit';
import { useTranslations } from 'use-intl';

import type { UserBadgesProps } from './UserBadges.types';

export const UserBadges = ({ user }: UserBadgesProps) => {
  const t = useTranslations('admin');

  return (
    <>
      {user.online && <Badge tone='primary'>{t('users.online')}</Badge>}
      {isStaffRole(user.role) && <Badge tone='primary'>{t(`roles.${user.role}`)}</Badge>}
      {user.developer && <Badge tone='outline'>{t('users.developer')}</Badge>}
      {user.verified && <Badge>{t('users.verified')}</Badge>}
      {user.blockedAt && <Badge tone='danger'>{t('users.blocked')}</Badge>}
    </>
  );
};
