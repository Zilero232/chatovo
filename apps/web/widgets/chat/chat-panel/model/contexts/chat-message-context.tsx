'use client';

import type { ReactNode } from 'react';

import { createContextHook } from '@siberiacancode/reactuse';

import type { ChatLine } from '../types';

import { useChatMessageItem } from '../hooks';

type ChatMessageParams = {
  canManage: boolean;
  isGrouped: boolean;
  isOwn: boolean;
  isTail: boolean;
  message: ChatLine;
  onDelete: (id: string) => void;
  onDiscard: (id: string) => void;
  onEdit: (id: string, body: string) => void;
  onRetry: (id: string, body: string) => void;
};

const useChatMessageState = ({
  message,
  isOwn,
  isGrouped,
  isTail,
  canManage,
  onEdit,
  onDelete,
  onRetry,
  onDiscard
}: ChatMessageParams) => {
  const item = useChatMessageItem({ message, isOwn, isGrouped, canManage });

  return {
    ...item,
    message,
    isOwn,
    isTail,
    requestDelete: () => item.setIsConfirmingDelete(true),
    confirmDelete: () => {
      onDelete(message.id);
      item.setIsConfirmingDelete(false);
    },
    saveEdit: (body: string) => onEdit(message.id, body),
    retry: () => onRetry(message.id, message.message),
    discard: () => onDiscard(message.id)
  };
};

const { Provider, use } = createContextHook(useChatMessageState);

export const ChatMessageProvider = ({
  children,
  ...params
}: ChatMessageParams & { children: ReactNode }) => (
  <Provider params={[params]}>{children}</Provider>
);

export const useChatMessage = () => {
  const value = use();

  if (!value) {
    throw new Error('useChatMessage must be used within ChatMessageProvider');
  }

  return value;
};
