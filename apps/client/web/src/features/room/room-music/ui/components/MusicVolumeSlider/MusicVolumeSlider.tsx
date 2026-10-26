import { Slider } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { useTranslations } from 'use-intl';

import { formatPercent } from '@/shared/lib';

import type { MusicVolumeSliderProps } from './MusicVolumeSlider.types';

import { MUSIC_VOLUME_SLIDER } from '../../../config/volume';
import { useMusicVolume } from '../../../model/hooks';
import { MusicVolumeIcon } from '../MusicVolumeIcon/MusicVolumeIcon';

import s from './MusicVolumeSlider.module.scss';

export const MusicVolumeSlider = ({ className }: MusicVolumeSliderProps) => {
  const t = useTranslations('room.music.volume');

  const { volume, setVolume } = useMusicVolume();

  return (
    <div className={clsx(s.root, className)}>
      <span className={s.icon}>
        <MusicVolumeIcon volume={volume} />
      </span>

      <Slider
        aria-label={t('label')}
        className={s.slider}
        getAriaValueText={(_, value) => formatPercent(value)}
        max={MUSIC_VOLUME_SLIDER.max}
        min={MUSIC_VOLUME_SLIDER.min}
        step={MUSIC_VOLUME_SLIDER.step}
        tone='subtle'
        value={volume}
        onValueChange={(next) => setVolume(next as number)}
      />
    </div>
  );
};
