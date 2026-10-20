'use client';

import { useScript } from '@siberiacancode/reactuse';
import { useEffect, useEffectEvent, useState } from 'react';

import type { MusicPlayerAdapter, SoundcloudWindow } from '../../lib';
import type { MusicTrackPlayback } from '../types';

import { SOUNDCLOUD } from '../../config/music';
import { buildSoundcloudSrc, toSoundcloudAdapter } from '../../lib';
import { useMusicPlayer } from './use-music-player';
import { useTrackAdvance } from './use-track-advance';

export const useSoundcloudPlayer = ({ music, track }: MusicTrackPlayback) => {
  const { advance, skipUnplayable, reportUnavailable } = useTrackAdvance(track.id);

  const scriptStatus = useScript(SOUNDCLOUD.apiSrc);

  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const [adapter, setAdapter] = useState<MusicPlayerAdapter | null>(null);

  const onFinish = useEffectEvent(() => advance());
  const onError = useEffectEvent(() => skipUnplayable());
  const onUnavailable = useEffectEvent(() => reportUnavailable());

  useEffect(() => {
    if (scriptStatus === 'error') {
      onUnavailable();
    }
  }, [scriptStatus]);

  useEffect(() => {
    const api = (window as SoundcloudWindow).SC;

    if (scriptStatus !== 'ready' || !iframe || !api) {
      return;
    }

    const widget = api.Widget(iframe);
    const { READY, FINISH, ERROR } = api.Widget.Events;

    widget.bind(READY, () => setAdapter(toSoundcloudAdapter(widget)));
    widget.bind(FINISH, () => onFinish());
    widget.bind(ERROR, () => onError());

    return () => {
      [READY, FINISH, ERROR].forEach((event) => widget.unbind(event));
      setAdapter(null);
    };
  }, [scriptStatus, iframe]);

  useMusicPlayer({ music, track, adapter });

  return { src: buildSoundcloudSrc(track.ref), setIframe };
};
