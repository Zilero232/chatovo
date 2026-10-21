import { useToastError } from '@/entities/app/locale';

import { usePlaybackControls } from '../playback/use-playback-controls';
import { useCurrentRoomMusic } from '../use-current-room-music';

export const useMusicQueue = () => {
  const toastError = useToastError();

  const { music, actions } = useCurrentRoomMusic();
  const { current } = usePlaybackControls();

  const queue = music?.queue ?? [];

  const remove = (trackId: string) => {
    actions.dequeue.mutate(trackId, { onError: toastError(`music-dequeue-${trackId}`) });
  };

  return {
    queue,
    isEmpty: current === null && queue.length === 0,
    remove
  };
};
