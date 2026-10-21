import { Popover, PopoverContent, PopoverTrigger } from '@chatovo/ui-kit';
import { Volume2, VolumeX } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { useMusicOutputSettings } from '../../../model/hooks';
import { MusicOutputSettings } from '../MusicOutputSettings/MusicOutputSettings';

import s from './MusicSettingsButton.module.scss';

export const MusicSettingsButton = () => {
  const t = useTranslations('room.music.settings');

  const { volume } = useMusicOutputSettings();

  return (
    <Popover>
      <PopoverTrigger
        aria-label={t('label')}
        className={s.trigger}
        size='icon'
        title={t('label')}
        variant='ghost'
      >
        {volume === 0 ? <VolumeX aria-hidden /> : <Volume2 aria-hidden />}
      </PopoverTrigger>
      <PopoverContent align='end' className={s.popover}>
        <MusicOutputSettings />
      </PopoverContent>
    </Popover>
  );
};
