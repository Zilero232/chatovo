import { Volume1, Volume2, VolumeX } from 'lucide-react';
import { match } from 'ts-pattern';

import type { MusicVolumeIconProps } from './MusicVolumeIcon.types';

import { MUSIC_VOLUME_SLIDER } from '../../../config/volume';

export const MusicVolumeIcon = ({ volume }: MusicVolumeIconProps) =>
  match(volume)
    .with(0, () => <VolumeX aria-hidden />)
    .when(
      (level) => level < MUSIC_VOLUME_SLIDER.quietBelow,
      () => <Volume1 aria-hidden />
    )
    .otherwise(() => <Volume2 aria-hidden />);
