import { clsx } from 'clsx';
import { createPortal } from 'react-dom';

import type { MusicTrackPlayback } from '../../../model/types';

import { usePlayerPlacement, usePlayerStatus } from '../../../model/hooks';
import { TrackPlayer } from '../TrackPlayer/TrackPlayer';

import s from './MusicPlayerHost.module.scss';

export const MusicPlayerHost = ({ music, track }: MusicTrackPlayback) => {
  const { setHost, isRaised } = usePlayerPlacement();
  const { status, attempt } = usePlayerStatus(track.id);

  return createPortal(
    <div
      ref={setHost}
      className={clsx(s.root, isRaised && s.raised, status !== 'ready' && s.pending)}
    >
      <TrackPlayer key={`${track.id}:${attempt}`} music={music} track={track} />
    </div>,
    document.body
  );
};
