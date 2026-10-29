import { Tooltip, TooltipContent } from '@chatovo/ui-kit';
import { Music } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { useInvisibleGuard } from '@/entities/room/room';

import { useCanControlMusic, useIsRoomMusicActive, useMusicDialog } from '../../model/hooks';

import s from './MusicButton.module.scss';

export const MusicButton = () => {
  const t = useTranslations('room');

  const canControl = useCanControlMusic();
  const isActive = useIsRoomMusicActive();
  const { isOpen, open } = useMusicDialog();
  const { notifyBlocked } = useInvisibleGuard();

  const label = canControl ? t('music.label') : t('controls.invisibleLocked');

  return (
    <Tooltip>
      <button
        aria-disabled={!canControl}
        aria-expanded={isOpen}
        aria-haspopup='dialog'
        aria-label={label}
        className={s.trigger}
        data-active={isActive || undefined}
        data-locked={!canControl || undefined}
        type='button'
        onClick={canControl ? open : notifyBlocked}
      >
        <Music />
      </button>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};
