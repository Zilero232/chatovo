import type { KeyboardEvent } from 'react';

import { ContextMenuItem, Slider } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { VolumeX } from 'lucide-react';
import { isNonNullish } from 'remeda';

import { formatPercent } from '@/shared/lib';

import type { VolumeRowProps } from './VolumeRow.types';

import { MAX_VOLUME, VOLUME_SLIDER_STEP } from '../../../../../config';
import { resolveVolumeKey } from '../../../../../lib';

import s from './VolumeRow.module.scss';

export const VolumeRow = ({
  icon,
  isMuted = false,
  label,
  muteLabel,
  sliderLabel,
  volume,
  onToggleMute,
  onVolumeChange
}: VolumeRowProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    const action = resolveVolumeKey({
      canMute: isNonNullish(onToggleMute),
      key: event.key,
      volume
    });

    if (!action) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (action.type === 'volume') {
      onVolumeChange(action.volume);
    } else {
      onToggleMute?.();
    }
  };

  return (
    <ContextMenuItem
      className={clsx(s.volumeItem, isMuted && s.muted)}
      closeOnClick={false}
      onKeyDown={handleKeyDown}
    >
      <div className={s.volumeRow}>
        <span className={s.volumeLabel}>{label}</span>
        <span className={s.volumeValue}>{formatPercent(isMuted ? 0 : volume)}</span>
      </div>

      <div className={s.volumeControl}>
        {onToggleMute ? (
          <button
            aria-label={muteLabel}
            aria-pressed={isMuted}
            className={s.muteButton}
            tabIndex={-1}
            title={muteLabel}
            type='button'
            onClick={onToggleMute}
          >
            {isMuted ? <VolumeX /> : icon}
          </button>
        ) : (
          <span aria-hidden className={s.volumeIcon}>
            {icon}
          </span>
        )}

        <Slider
          aria-label={sliderLabel}
          className={s.slider}
          max={MAX_VOLUME}
          min={0}
          step={VOLUME_SLIDER_STEP}
          value={volume}
          onValueChange={(next) => onVolumeChange(next as number)}
        />
      </div>
    </ContextMenuItem>
  );
};
