import type { RoomBan } from '@chatovo/schemas';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useToastError } from '@/entities/app/locale';
import { unbanRoomUser } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

export const useUnbanRoomUser = (roomId: string) => {
  const t = useTranslations('roomModeration.bans');
  const toastError = useToastError();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ user }: RoomBan) => unbanRoomUser({ roomId, userId: user.id }),
    onSuccess: (_data, { user }) => {
      queryClient.setQueryData<RoomBan[]>(QUERY_KEYS.roomBans(roomId), (bans) =>
        bans?.filter((ban) => ban.user.id !== user.id)
      );

      toast.success(t('unbanned', { name: user.name }), { id: `room-unban-${user.id}` });
    },
    onError: (error, { user }) => {
      toastError(`room-unban-${user.id}`)(error);
    }
  });
};
