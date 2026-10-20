import { PlayInRoomButton } from '@/features/room/room-music';

import { useChatMessage } from '../../../../../model/contexts';
import { LinkPreviewCard } from '../LinkPreviewCard/LinkPreviewCard';
import { MessageActions } from '../MessageActions/MessageActions';
import { MessageBody } from '../MessageBody/MessageBody';
import { MessageBubble } from '../MessageBubble/MessageBubble';
import { MessageMeta } from '../MessageMeta/MessageMeta';
import { MessageStatus } from '../MessageStatus/MessageStatus';

import s from '../../ChatMessageItem.module.scss';

export const MessageColumn = () => {
  const { message, isOwn, isDeleted, previewUrl, showHeader, showActions } = useChatMessage();

  return (
    <div className={s.column} data-own={isOwn}>
      {showHeader && <MessageMeta />}

      <div className={s.bodyRow} data-own={isOwn}>
        <MessageBody bubble={<MessageBubble />} isDeleted={isDeleted} />

        {showActions && <MessageActions />}
      </div>

      {previewUrl !== null && (
        <>
          <LinkPreviewCard url={previewUrl} />
          <PlayInRoomButton url={previewUrl} />
        </>
      )}

      {message.status && <MessageStatus status={message.status} />}
    </div>
  );
};
