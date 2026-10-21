import { parseMusicLink } from '@chatovo/schemas';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useToastError } from '@/entities/app/locale';
import { useRoomMusicActions } from '@/entities/room/music';

import { useMaybeRoomMusicContext } from '../contexts';

export const usePlayInRoom = (url: string) => {
  const t = useTranslations('room.music.add');
  const toastError = useToastError();

  const roomId = useMaybeRoomMusicContext()?.roomId ?? '';

  const { enqueue } = useRoomMusicActions(roomId);

  const canPlay = roomId !== '' && parseMusicLink(url) !== null;

  const play = () => {
    enqueue.mutate(
      { kind: 'link', url },
      {
        onSuccess: () => toast.success(t('added'), { id: 'music-enqueue' }),
        onError: toastError('music-enqueue')
      }
    );
  };

  return { canPlay, isPending: enqueue.isPending, play };
};
