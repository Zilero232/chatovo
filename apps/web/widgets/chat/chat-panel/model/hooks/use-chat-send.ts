'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { sendChatMessage } from '@/shared/api';

import type { ChatLine } from '../types';

import { appendChatDto, appendChatMessage, dropChatLine, markChatLineStatus } from '../lib';

type SendVariables = {
  body: string;
  id: string;
};

type UseChatSendParams = {
  roomId: string;
  sender: NonNullable<ChatLine['from']>;
};

export const useChatSend = ({ roomId, sender }: UseChatSendParams) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, body }: SendVariables) => sendChatMessage(id, roomId, body),
    onMutate: ({ id, body }) => {
      appendChatMessage(queryClient, roomId, {
        id,
        timestamp: Date.now(),
        message: body,
        status: 'sending',
        from: sender
      });
    },
    onSuccess: (saved) => {
      appendChatDto(queryClient, roomId, saved);
    },
    onError: (_error, { id }) => {
      markChatLineStatus(queryClient, roomId, id, 'failed');
    }
  });

  const send = async (body: string, id?: string) => {
    if (id) {
      markChatLineStatus(queryClient, roomId, id, 'sending');
    }

    try {
      await mutateAsync({ id: id ?? crypto.randomUUID(), body });
    } catch {}
  };

  const retry = (id: string, body: string) => send(body, id);

  const discard = (id: string) => {
    dropChatLine(queryClient, roomId, id);
  };

  return { send, retry, discard, isPending };
};
