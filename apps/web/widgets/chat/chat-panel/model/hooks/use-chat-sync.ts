'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { deleteChatMessage, editChatMessage } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

import { deleteChatMessageInCache, editChatMessageInCache } from '../lib';

type EditVariables = {
  body: string;
  id: string;
};

export const useChatSync = (roomId: string) => {
  const t = useTranslations('chat');
  const queryClient = useQueryClient();
  const queryKey = QUERY_KEYS.chatMessages(roomId);

  const editMutation = useMutation({
    mutationFn: ({ id, body }: EditVariables) => editChatMessage(id, body),
    onMutate: ({ id, body }) => {
      editChatMessageInCache(queryClient, roomId, id, body, Date.now());
    },
    onError: async (_error, { id }) => {
      await queryClient.invalidateQueries({ queryKey });
      toast.error(t('editFailed'), { id: `chat-message-edit-${id}` });
    }
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => deleteChatMessage(id),
    onMutate: (id) => {
      deleteChatMessageInCache(queryClient, roomId, id, Date.now());
    },
    onError: async (_error, id) => {
      await queryClient.invalidateQueries({ queryKey });
      toast.error(t('deleteFailed'), { id: `chat-message-delete-${id}` });
    }
  });

  const edit = (id: string, body: string) => editMutation.mutate({ id, body });
  const remove = (id: string) => removeMutation.mutate(id);

  return { edit, remove };
};
