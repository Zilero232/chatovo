import { Button } from '@chatovo/ui-kit';
import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { UserAvatar, UserName } from '@/entities/auth/user';

import type { BlockedListItemProps } from './BlockedListItem.types';

import s from './BlockedListItem.module.scss';

export const BlockedListItem = ({ isBusy, user, onUnblock }: BlockedListItemProps) => {
  const t = useTranslations('blocks');

  return (
    <div className={s.root}>
      <UserAvatar className={s.avatar} name={user.name} size='sm' src={user.avatarUrl} />
      <UserName
        className={s.name}
        developer={user.developer}
        name={user.name}
        verified={user.verified}
      />
      <Button
        aria-label={t('unblockUser', { name: user.name })}
        className={s.unblock}
        disabled={isBusy}
        size='sm'
        variant='secondary'
        onClick={onUnblock}
      >
        <ShieldCheck aria-hidden />
        {t('unblock')}
      </Button>
    </div>
  );
};
