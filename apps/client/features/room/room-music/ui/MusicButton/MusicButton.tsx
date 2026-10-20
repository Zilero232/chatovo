'use client';

import { Music } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Tooltip, TooltipContent } from '@/ui-kit';

import { useIsRoomMusicActive, useMusicDialog } from '../../model/hooks';

import s from './MusicButton.module.scss';

export const MusicButton = () => {
  const t = useTranslations('room.music');

  const isActive = useIsRoomMusicActive();
  const { isOpen, open } = useMusicDialog();

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
