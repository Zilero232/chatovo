import { useEffect, useEffectEvent, useState } from 'react';

import type { MusicPlayerAdapter, YoutubePlayer } from '../../lib';
import type { MusicTrackPlayback } from '../types';

import { YOUTUBE } from '../../config/music';
import { mountYoutubePlayer, toYoutubeAdapter } from '../../lib';
import { useMusicPlayer } from './use-music-player';
import { useTrackAdvance } from './use-track-advance';

export const useYoutubePlayer = ({ music, track }: MusicTrackPlayback) => {
  const { advance, skipUnplayable, reportUnavailable } = useTrackAdvance(track.id);

  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [adapter, setAdapter] = useState<MusicPlayerAdapter | null>(null);

  const onStateChange = useEffectEvent((state: number) => {
    if (state === YOUTUBE.state.ended) {
      advance();
    }
  });

  const onError = useEffectEvent((code: number) => {
    if (YOUTUBE.fatalErrorCodes.has(code)) {
      skipUnplayable();
    } else {
      reportUnavailable();
    }
  });

  const onUnavailable = useEffectEvent(() => reportUnavailable());

  useEffect(() => {
    if (!container) {
      return;
    }

    const host = document.createElement('div');
    let player: YoutubePlayer | null = null;
    let isActive = true;

    container.append(host);

    mountYoutubePlayer({
      host,
      videoId: track.ref,
      events: {
        onReady: ({ target }) => isActive && setAdapter(toYoutubeAdapter(target)),
        onStateChange: ({ data }) => onStateChange(data),
        onError: ({ data }) => onError(data)
      }
    })
      .then((mounted) => {
        player = mounted;

        if (!isActive) {
          mounted?.destroy();
        } else if (!mounted) {
          onUnavailable();
        }
      })
      .catch(() => isActive && onUnavailable());

    return () => {
      isActive = false;
      setAdapter(null);
      player?.destroy();
      container.replaceChildren();
    };
  }, [container, track.ref]);

  useMusicPlayer({ music, track, adapter });

  return setContainer;
};
