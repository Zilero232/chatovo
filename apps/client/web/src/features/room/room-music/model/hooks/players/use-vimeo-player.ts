import type VimeoPlayer from '@vimeo/player';

import { useEffect, useEffectEvent, useState } from 'react';

import type { MusicPlayerAdapter } from '../../../lib/index';
import type { MusicTrackPlayback } from '../../types';

import { VIMEO_OPTIONS } from '../../../config/music';
import { toVimeoAdapter, toVimeoUrl } from '../../../lib/index';
import { useTrackAdvance } from '../playback/use-track-advance';
import { useMusicPlayer } from './use-music-player';

export const useVimeoPlayer = ({ music, track }: MusicTrackPlayback) => {
  const { advance, reportUnavailable } = useTrackAdvance(track.id);

  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [adapter, setAdapter] = useState<MusicPlayerAdapter | null>(null);

  const onEnded = useEffectEvent(() => advance());
  const onFailed = useEffectEvent(() => reportUnavailable('failed'));
  const onUnavailable = useEffectEvent(() => reportUnavailable('network'));
  const onBlocked = useEffectEvent(() => reportUnavailable('blocked'));

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
          .then(
            () =>
              isActive &&
              setAdapter(toVimeoAdapter({ player: mounted, onBlocked: () => onBlocked() }))
          )
          .catch(() => isActive && onFailed());
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
