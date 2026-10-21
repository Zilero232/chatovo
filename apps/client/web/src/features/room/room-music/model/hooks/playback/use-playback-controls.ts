import { useToastError } from '@/entities/app/locale';

import { useCurrentRoomMusic } from '../use-current-room-music';

export const usePlaybackControls = () => {
  const toastError = useToastError();

  const { music, actions } = useCurrentRoomMusic();

  const { control } = actions;
  const current = music?.current ?? null;
  const isPlaying = music?.playback?.status === 'playing';
  const onError = toastError('music-control');

  const togglePlay = () => {
    control.mutate({ action: isPlaying ? 'pause' : 'play' }, { onError });
  };

  const next = () => {
    if (current) {
      control.mutate({ action: 'next', trackId: current.id }, { onError });
    }
  };

  const previous = () => {
    control.mutate({ action: 'previous' }, { onError });
  };

  const stop = () => {
    control.mutate({ action: 'stop' }, { onError });
  };

  return {
    music,
    current,
    isPlaying,
    isPending: control.isPending,
    togglePlay,
    previous,
    next,
    stop
  };
};
