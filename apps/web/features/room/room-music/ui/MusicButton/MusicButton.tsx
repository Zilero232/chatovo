'use client';

import { Tooltip, TooltipContent } from '@chatovo/ui-kit';
import { Music } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useCanControlMusic, useIsRoomMusicActive, useMusicDialog } from '../../model/hooks';

import s from './MusicButton.module.scss';

export const MusicButton = () => {
  const t = useTranslations('room.music');

  const canControl = useCanControlMusic();
  const isActive = useIsRoomMusicActive();
  const { isOpen, open } = useMusicDialog();

  if (!canControl) {
    return null;
  }

  return (
    <Tooltip>
      <button
        aria-expanded={isOpen}
        aria-haspopup='dialog'
        aria-label={t('label')}
        className={s.trigger}
        data-active={isActive || undefined}
        type='button'
        onClick={open}
      >
        <Music />
      </button>
      <TooltipContent>{t('label')}</TooltipContent>
    </Tooltip>
  );
};
