'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { formatPercent } from '@/shared/lib';
import { Slider, Switch } from '@/ui-kit';

import { useMusicOutputSettings } from '../../../model/hooks';

import s from './MusicOutputSettings.module.scss';

export const MusicOutputSettings = () => {
  const t = useTranslations('room.music.settings');

  const { volume, ducking, setVolume, setDucking } = useMusicOutputSettings();

  return (
    <div className={s.root}>
      <div className={s.row}>
        {volume === 0 ? (
          <VolumeX aria-hidden className={s.icon} />
        ) : (
          <Volume2 aria-hidden className={s.icon} />
        )}
        <Slider
          aria-label={t('volume')}
          className={s.slider}
          max={1}
          min={0}
          step={0.01}
          value={volume}
          onValueChange={(next) => setVolume(next as number)}
        />
        <span className={s.value}>{formatPercent(volume)}</span>
      </div>

      <label className={s.row}>
        <span className={s.toggleLabel}>{t('ducking')}</span>
        <Switch checked={ducking} onCheckedChange={setDucking} />
      </label>
    </div>
  );
};
