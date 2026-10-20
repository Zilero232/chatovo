'use client';

import { clsx } from 'clsx';
import { createPortal } from 'react-dom';

import type { MusicTrackPlayback } from '../../../model/types';

import { usePlayerPlacement } from '../../../model/hooks';
import { TrackPlayer } from '../TrackPlayer/TrackPlayer';

import s from './MusicPlayerHost.module.scss';

export const MusicPlayerHost = ({ music, track }: MusicTrackPlayback) => {
  const { setHost, isRaised } = usePlayerPlacement();

  return createPortal(
    <div ref={setHost} className={clsx(s.root, isRaised && s.raised)}>
      <TrackPlayer key={track.id} music={music} track={track} />
    </div>,
    document.body
  );
};
