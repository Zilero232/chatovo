'use client';

import { clsx } from 'clsx';
import { Music, Radio } from 'lucide-react';
import Image from 'next/image';

import type { TrackArtworkProps } from './TrackArtwork.types';

import { TRACK_ARTWORK_SIZES } from '../../../config/music';

import s from './TrackArtwork.module.scss';

export const TrackArtwork = ({ track, size, className }: TrackArtworkProps) => {
  const FallbackIcon = track.source === 'radio' ? Radio : Music;

  return (
    <span className={clsx(s.root, s[size], className)}>
      {track.artwork ? (
        <Image
          fill
          alt=''
          className={s.image}
          sizes={TRACK_ARTWORK_SIZES[size]}
          src={track.artwork}
        />
      ) : (
        <FallbackIcon aria-hidden className={s.icon} />
      )}
    </span>
  );
};
