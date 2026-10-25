import { Slider, Switch } from '@chatovo/ui-kit';
import { useTranslations } from 'use-intl';

import type { SoundCategory } from '@/entities/app/settings';

import { useAppSettings } from '@/entities/app/settings';
import { formatPercent } from '@/shared/lib';

import { SettingRow } from '../components/SettingRow/SettingRow';

import s from '../AppSettingsButton.module.scss';

const SOUND_CATEGORIES: SoundCategory[] = [
  'join',
  'leave',
  'mute',
  'reconnect',
  'message',
  'reaction',
  'call',
  'ambience'
];

export const SoundsTab = () => {
  const t = useTranslations('settings.sounds');
  const { settings, setGroup, toggleSound } = useAppSettings();

  const { sounds, music } = settings;

  return (
    <div className={s.tabPanel}>
      <SettingRow
        stacked
        control={
          <div className={s.sliderRow}>
            <Slider
              aria-label={t('volumeLabel')}
              max={1}
              min={0}
              step={0.05}
              value={sounds.volume}
              onValueChange={(value) => setGroup('sounds', { volume: value as number })}
            />
            <span className={s.sliderValue}>{formatPercent(sounds.volume)}</span>
          </div>
        }
        hint={t('volumeHint')}
        label={t('volumeLabel')}
      />

      <SettingRow
        stacked
        control={
          <div className={s.sliderRow}>
            <Slider
              aria-label={t('musicVolume')}
              max={1}
              min={0}
              step={0.05}
              value={music.volume}
              onValueChange={(value) => setGroup('music', { volume: value as number })}
            />
            <span className={s.sliderValue}>{formatPercent(music.volume)}</span>
          </div>
        }
        hint={t('musicVolumeHint')}
        label={t('musicVolume')}
      />

      <SettingRow
        control={
          <Switch
            checked={music.ducking}
            onCheckedChange={(value) => setGroup('music', { ducking: value })}
          />
        }
        hint={t('musicDuckingHint')}
        label={t('musicDucking')}
      />

      {SOUND_CATEGORIES.map((category) => (
        <SettingRow
          key={category}
          control={
            <Switch
              checked={sounds.enabled[category]}
              onCheckedChange={() => toggleSound(category)}
            />
          }
          hint={t(`${category}Hint`)}
          label={t(category)}
        />
      ))}
    </div>
  );
};
