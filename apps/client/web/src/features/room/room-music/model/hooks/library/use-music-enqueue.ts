import type { MusicEnqueueItem } from '@chatovo/schemas';

import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useToastError } from '@/entities/app/locale';

import { useCurrentRoomMusic } from '../use-current-room-music';

type EnqueueMusicInput = {
  item: MusicEnqueueItem;
  onAdded?: () => void;
};

export const useMusicEnqueue = () => {
  const t = useTranslations('room.music.add');
  const toastError = useToastError();

  const { actions } = useCurrentRoomMusic();

  const enqueue = ({ item, onAdded }: EnqueueMusicInput) => {
    actions.enqueue.mutate(item, {
      onSuccess: () => {
        toast.success(t('added'), { id: 'music-enqueue' });
        onAdded?.();
      },
      onError: toastError('music-enqueue')
    });
  };

  return { enqueue, isAdding: actions.enqueue.isPending };
};
