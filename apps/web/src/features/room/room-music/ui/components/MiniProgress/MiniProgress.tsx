import type { MusicTrackPlayback } from '../../../model/types';

import { usePlaybackProgress } from '../../../model/hooks';

import s from './MiniProgress.module.scss';

export const MiniProgress = ({ music, track }: MusicTrackPlayback) => {
  const { isLive, positionMs, durationMs } = usePlaybackProgress({ music, track });

  if (isLive || durationMs === null || durationMs === 0) {
    return null;
  }

  return (
    <span aria-hidden className={s.root}>
      <span className={s.fill} style={{ transform: `scaleX(${positionMs / durationMs})` }} />
    </span>
  );
};
