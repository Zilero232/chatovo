import { Button } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { MessageSquare } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { formatBadgeCount } from '@/shared/lib';
import { useChatUnread } from '@/widgets/chat/chat-panel';

import type { VoiceRoomChatButtonProps } from './VoiceRoomChatButton.types';

import { useCurrentRoomId } from '../../../model/hooks';

import s from './VoiceRoomChatButton.module.scss';

export const VoiceRoomChatButton = ({ isOpen, onToggle }: VoiceRoomChatButtonProps) => {
  const t = useTranslations('chat');
  const roomId = useCurrentRoomId();
  const unread = useChatUnread(roomId, isOpen);

  return (
    <div className={s.wrap}>
      <Button
        aria-label={isOpen ? t('hide') : t('open')}
        aria-pressed={isOpen}
        className={s.button}
        size='icon-lg'
        type='button'
        variant={isOpen ? 'secondary' : 'ghost'}
        onClick={onToggle}
      >
        <MessageSquare />
      </Button>

      {unread > 0 && !isOpen && (
        <span key={unread} aria-live='polite' className={clsx(s.badge, s.badgePulse)}>
          {formatBadgeCount(unread)}
        </span>
      )}
    </div>
  );
};
