'use client';

import { useFileDialog } from '@siberiacancode/reactuse';
import { Camera } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { UserAvatar } from '@/entities/auth/user';

import type { AvatarFieldProps } from './AvatarField.types';

import s from '../../UpdateProfileForm.module.scss';

export const AvatarField = ({ name, src, onPick, onRemove }: AvatarFieldProps) => {
  const t = useTranslations('settings.profile');

  const { open } = useFileDialog(
    (files) => {
      const file = files?.[0];

      if (!file) {
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error(t('avatarInvalidType'), { id: 'avatar-invalid-type' });

        return;
      }

      onPick(file);
    },
    { accept: 'image/*', multiple: false, reset: true }
  );

  return (
    <div className={s.avatarRow}>
      <button
        aria-label={t('avatarLabel')}
        className={s.avatarButton}
        type='button'
        onClick={() => open()}
      >
        <UserAvatar colorize className={s.avatar} name={name} size='lg' sizes='64px' src={src} />

        <span className={s.avatarOverlay}>
          <Camera aria-hidden className={s.avatarOverlayIcon} />
        </span>
      </button>

      <div className={s.avatarMeta}>
        <span className={s.label}>{t('avatarLabel')}</span>
        <span className={s.hint}>{t('avatarHint')}</span>
        {src && (
          <button className={s.avatarRemove} type='button' onClick={onRemove}>
            {t('avatarRemove')}
          </button>
        )}
      </div>
    </div>
  );
};
