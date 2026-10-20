'use client';

import { AVATAR_MAX_DIMENSION } from '@chatovo/schemas';
import { Button, Dialog, DialogContent, DialogDescription, DialogTitle } from '@chatovo/ui-kit';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import type { AvatarZoomProps } from './AvatarZoom.types';

import s from './AvatarZoom.module.scss';

export const AvatarZoom = ({ src, name, children }: AvatarZoomProps) => {
  const t = useTranslations('profileCard');

  if (!src) {
    return <>{children}</>;
  }

  return (
    <Dialog
      trigger={
        <Button aria-label={t('zoomAvatar')} className={s.trigger} type='button'>
          {children}
        </Button>
      }
    >
      <DialogContent
        className={s.content}
        overlayClassName={s.overlay}
        popupClassName={s.modal}
        showCloseButton={false}
      >
        <DialogTitle className='sr-only'>{t('avatarAlt', { name })}</DialogTitle>
        <DialogDescription className='sr-only'>{t('avatarZoomDescription')}</DialogDescription>
        <Image
          alt={t('avatarAlt', { name })}
          className={s.image}
          height={AVATAR_MAX_DIMENSION}
          sizes='(max-width: 30rem) 100vw, 28rem'
          src={src}
          width={AVATAR_MAX_DIMENSION}
        />
      </DialogContent>
    </Dialog>
  );
};
