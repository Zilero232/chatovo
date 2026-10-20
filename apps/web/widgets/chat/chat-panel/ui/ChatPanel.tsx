'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { target, useEventListener } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import type { ChatPanelProps } from './ChatPanel.types';

import { ChatConversation } from './ChatConversation/ChatConversation';
import { ChatHeader } from './components';

import s from './ChatPanel.module.scss';

export const ChatPanel = ({ roomId, isOpen, onClose }: ChatPanelProps) => {
  const t = useTranslations('chat');
  const { localParticipant } = useLocalParticipant();

  useEventListener(target(window), 'keydown', (event) => {
    if (!isOpen || event.key !== 'Escape' || event.defaultPrevented) {
      return;
    }

    const active = document.activeElement;
    const isEditing =
      active instanceof HTMLTextAreaElement ||
      active instanceof HTMLInputElement ||
      (active instanceof HTMLElement && active.isContentEditable);

    if (isEditing) {
      return;
    }

    event.preventDefault();
    onClose();
  });

  return (
    <>
      <button
        aria-label={t('close')}
        className={s.scrim}
        data-open={isOpen}
        tabIndex={isOpen ? 0 : -1}
        type='button'
        onClick={onClose}
      />

      <aside className={clsx('glass-strong', 'pb-safe', s.root)} data-open={isOpen} inert={!isOpen}>
        <ChatHeader onClose={onClose} />
        <ChatConversation
          currentUserId={localParticipant.identity}
          enabled={isOpen}
          roomId={roomId}
        />
      </aside>
    </>
  );
};
