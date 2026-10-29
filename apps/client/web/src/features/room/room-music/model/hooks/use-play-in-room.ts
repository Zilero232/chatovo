import { parseMusicLink } from '@chatovo/schemas';

import { useToastError } from '@/entities/app/locale';
import { useRoomMusicActions } from '@/entities/room/music';

import { useMaybeRoomMusicContext } from '../contexts';

export const usePlayInRoom = (url: string) => {
  const toastError = useToastError();

  const context = useMaybeRoomMusicContext();
  const roomId = context?.roomId ?? '';

  const { enqueue } = useRoomMusicActions(roomId);

  const link = parseMusicLink(url);
  const canPlay = roomId !== '' && Boolean(context?.canControl) && link !== null;

  const play = () => {
    if (enqueue.isPending || enqueue.isSuccess) {
      return;
    }

    enqueue.mutate({ kind: 'link', url }, { onError: toastError('music-enqueue') });
  };

  return {
    source: link?.source ?? null,
    canPlay,
    isPending: enqueue.isPending,
    isAdded: enqueue.isSuccess,
    play
  };
};
