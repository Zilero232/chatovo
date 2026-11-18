import { Pencil } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { useCurrentUser, UserAvatar } from '@/entities/auth/user';

import type { SettingsProfileCardProps } from './SettingsProfileCard.types';

import s from '../../AppSettingsButton.module.scss';

export const SettingsProfileCard = ({ onEdit }: SettingsProfileCardProps) => {
  const t = useTranslations('settings');

  const { displayName, avatarUrl } = useCurrentUser();

  return (
    <button className={s.profileCard} type='button' onClick={onEdit}>
      <UserAvatar className={s.profileCardAvatar} name={displayName} sizes='48px' src={avatarUrl} />

      <span className={s.profileCardText}>
        <span className={s.profileCardName}>{displayName}</span>
        <span className={s.profileCardEdit}>
          {t('editProfile')}
          <Pencil aria-hidden />
        </span>
      </span>
    </button>
  );
};
