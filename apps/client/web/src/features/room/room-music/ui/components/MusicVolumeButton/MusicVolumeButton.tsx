import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger
} from '@chatovo/ui-kit';
import { useTranslations } from 'use-intl';

import type { MusicVolumeButtonProps } from './MusicVolumeButton.types';

import { useMusicVolume } from '../../../model/hooks';
import { MusicVolumeIcon } from '../MusicVolumeIcon/MusicVolumeIcon';
import { MusicVolumeSlider } from '../MusicVolumeSlider/MusicVolumeSlider';

import s from './MusicVolumeButton.module.scss';

export const MusicVolumeButton = ({ className }: MusicVolumeButtonProps) => {
  const t = useTranslations('room.music.volume');

  const { volume } = useMusicVolume();

  return (
    <Popover>
      <PopoverTrigger
        aria-label={t('label')}
        className={className}
        size='icon-sm'
        title={t('label')}
        variant='ghost'
      >
        <MusicVolumeIcon volume={volume} />
      </PopoverTrigger>

      <PopoverContent align='end' className={s.popover} side='top'>
        <PopoverHeader>
          <PopoverTitle>{t('label')}</PopoverTitle>
          <PopoverDescription>{t('hint')}</PopoverDescription>
        </PopoverHeader>

        <MusicVolumeSlider />
      </PopoverContent>
    </Popover>
  );
};
