import { toast } from 'sonner';
import { match } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import { useRealtimeMessage } from '@/entities/app/realtime';
import { useRoomSession } from '@/entities/room/session';

export const useRoomModerationNotices = (leave: (roomId: string) => void) => {
  const t = useTranslations('roomModeration.notices');

  const { session } = useRoomSession();

  useRealtimeMessage((message) => {
    if (message.type !== 'room.moderation') {
      return;
    }

    const { roomId, roomName, action } = message;
    const description = t('roomName', { name: roomName });
    const isInRoom = session?.roomId === roomId;
    const isEvicted = action === 'removed' || action === 'banned';

    match({ isEvicted, isInRoom })
      .with({ isEvicted: true, isInRoom: true }, () => {
        toast.error(t(action), { id: `room-access-${roomId}`, description });
        leave(roomId);
      })
      .with({ isEvicted: true }, () => {
        toast.error(t(action), { id: `room-access-${roomId}`, description });
      })
      .with({ isInRoom: true }, () => {
        toast.info(t(action), { id: `room-mic-${roomId}`, description });
      })
      .otherwise(() => undefined);
  });
};
