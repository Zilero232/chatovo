'use client';

import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '@chatovo/ui-kit';

import type { MessageContextMenuProps } from './MessageContextMenu.types';

import { useChatMessage } from '../../../../../model/contexts';
import { MessageMenuItems } from '../MessageMenuItems/MessageMenuItems';

import s from './MessageContextMenu.module.scss';

export const MessageContextMenu = ({ children }: MessageContextMenuProps) => {
  const { showActions, canReport } = useChatMessage();

  if (!showActions && !canReport) {
    return children;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>

      <ContextMenuContent className={s.content}>
        <MessageMenuItems />
      </ContextMenuContent>
    </ContextMenu>
  );
};
