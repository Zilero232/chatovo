'use client';

import type { ChatMessageItemProps } from './ChatMessageItem.types';

import { ChatMessageProvider, useChatMessage } from '../../../model/contexts';
import { MessageColumn, MessageDialogs } from './components';

import s from './ChatMessageItem.module.scss';

const ChatMessageItemBody = () => {
  const { message, isOwn } = useChatMessage();

  return (
    <div
      data-message-root
      className={s.root}
      data-own={isOwn}
      data-pending={message.status === 'sending'}
    >
      <MessageColumn />

      <MessageDialogs />
    </div>
  );
};

export const ChatMessageItem = (props: ChatMessageItemProps) => (
  <ChatMessageProvider {...props}>
    <ChatMessageItemBody />
  </ChatMessageProvider>
);
