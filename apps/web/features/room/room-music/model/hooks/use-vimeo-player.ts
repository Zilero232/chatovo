'use client';

import type VimeoPlayer from '@vimeo/player';

import { useEffect, useEffectEvent, useState } from 'react';

import type { MusicPlayerAdapter } from '../../lib';
import type { MusicTrackPlayback } from '../types';

import { VIMEO_OPTIONS } from '../../config/music';
import { toVimeoAdapter, toVimeoUrl } from '../../lib';
import { useMusicPlayer } from './use-music-player';
import { useTrackAdvance } from './use-track-advance';

export const useVimeoPlayer = ({ music, track }: MusicTrackPlayback) => {
  const { advance, skipUnplayable, reportUnavailable } = useTrackAdvance(track.id);

  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [adapter, setAdapter] = useState<MusicPlayerAdapter | null>(null);

  const onEnded = useEffectEvent(() => advance());
  const onUnplayable = useEffectEvent(() => skipUnplayable());
  const onUnavailable = useEffectEvent(() => reportUnavailable());

  useEffect(() => {
    const url = toVimeoUrl(track.ref);

    if (!container || !url) {
      return;
    }

    let player: VimeoPlayer | null = null;
    let isActive = true;

    import('@vimeo/player')
      .then(({ default: Player }) => {
        if (!isActive) {
          return;
        }

        const mounted = new Player(container, { url, ...VIMEO_OPTIONS });

        player = mounted;
        mounted.on('ended', () => onEnded());
        mounted
          .ready()
          .then(() => isActive && setAdapter(toVimeoAdapter(mounted)))
          .catch(() => isActive && onUnplayable());
      })
      .catch(() => isActive && onUnavailable());

    return () => {
      isActive = false;
      setAdapter(null);
      void player?.destroy().catch(() => {});
    };
  }, [container, track.ref]);

  useMusicPlayer({ music, track, adapter });

  return setContainer;
};
