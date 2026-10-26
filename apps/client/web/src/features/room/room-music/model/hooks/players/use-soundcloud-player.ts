import { useScript } from '@siberiacancode/reactuse';
import { useEffect, useEffectEvent, useState } from 'react';

import type { MusicPlayerAdapter, SoundcloudWindow } from '../../../lib/index';
import type { MusicTrackPlayback } from '../../types';

import { SOUNDCLOUD } from '../../../config/music';
import { buildSoundcloudSrc, toSoundcloudAdapter } from '../../../lib/index';
import { useTrackAdvance } from '../playback/use-track-advance';
import { useMusicPlayer } from './use-music-player';

export const useSoundcloudPlayer = ({ music, track }: MusicTrackPlayback) => {
  const { advance, reportUnavailable } = useTrackAdvance(track.id);

  const scriptStatus = useScript(SOUNDCLOUD.apiSrc);

  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const [adapter, setAdapter] = useState<MusicPlayerAdapter | null>(null);

  const onFinish = useEffectEvent(() => advance());
  const onError = useEffectEvent(() => reportUnavailable('failed'));
  const onUnavailable = useEffectEvent(() => reportUnavailable('network'));

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
