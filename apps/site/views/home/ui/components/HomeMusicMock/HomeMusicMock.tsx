import { Chato } from '@chatovo/ui-kit';
import { Music, Pause, SkipForward } from 'lucide-react';

import type { HomeMusicMockProps } from './HomeMusicMock.types';

import s from './HomeMusicMock.module.scss';

export const HomeMusicMock = ({ title, subtitle }: HomeMusicMockProps) => (
  <div aria-hidden className={s.musicMock}>
    <Chato className={s.musicMockChato} pose='listen' />
    <div className={s.musicMockPlayer}>
      <span className={s.musicMockArt}>
        <Music />
      </span>
      <span className={s.musicMockMeta}>
        <span className={s.musicMockTitle}>{title}</span>
        <span className={s.musicMockSubtitle}>{subtitle}</span>
      </span>
      <span className={s.musicMockControls}>
        <Pause />
        <SkipForward />
      </span>
      <span className={s.musicMockProgress} />
    </div>
  </div>
);
