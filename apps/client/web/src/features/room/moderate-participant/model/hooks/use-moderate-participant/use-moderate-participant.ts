import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { useToastError } from '@/entities/app/locale';
import { moderateRoomParticipant } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

import type { ModerateParticipantVariables } from './use-moderate-participant.types';

export const useModerateParticipant = () => {
  const t = useTranslations('roomModeration.toasts');
  const toastError = useToastError();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, userId, action }: ModerateParticipantVariables) =>
      moderateRoomParticipant({ roomId, userId, action }),
    onSuccess: async (_data, { roomId, userId, userName, action }) => {
      toast.success(t(action, { name: userName }), { id: `room-moderation-${userId}` });

      if (action === 'ban') {
        await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roomBans(roomId) });
      }
    },
    onError: (error, { userId }) => {
      toastError(`room-moderation-${userId}`)(error);
    }
  });
};
