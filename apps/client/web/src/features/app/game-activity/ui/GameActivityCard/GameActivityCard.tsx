import { Tooltip, TooltipContent } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { Eye, EyeOff, Gamepad2, SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { useGameActivityCard } from '../../model/hooks';

import s from './GameActivityCard.module.scss';

export const GameActivityCard = () => {
  const t = useTranslations('gameActivity');

  const { game, isSharing, toggleSharing, openSettings } = useGameActivityCard();

  if (!game) {
    return null;
  }

  return (
    <div className={s.root}>
      <span aria-hidden className={s.cover}>
        <Gamepad2 />
      </span>

      <div className={s.text}>
        <span className={s.name}>{game}</span>
        <span className={clsx(s.status, { [s.statusLive]: isSharing })}>
          {isSharing ? t('shared') : t('hidden')}
        </span>
      </div>

      <Tooltip>
        <button
          aria-label={isSharing ? t('hide') : t('share')}
          aria-pressed={isSharing}
          className={s.action}
          type='button'
          onClick={toggleSharing}
        >
          {isSharing ? <Eye /> : <EyeOff />}
        </button>
        <TooltipContent>{isSharing ? t('hide') : t('share')}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <button
          aria-label={t('settings')}
          className={s.action}
          type='button'
          onClick={openSettings}
        >
          <SlidersHorizontal />
        </button>
        <TooltipContent>{t('settings')}</TooltipContent>
      </Tooltip>
    </div>
  );
};
