'use client';

import { isImageMime } from '@chatovo/schemas';
import dynamic from 'next/dynamic';

import { useChatMessage } from '../../../../../model/contexts';
import { MessageAttachment } from '../MessageAttachment/MessageAttachment';
import { MessageContextMenu } from '../MessageContextMenu/MessageContextMenu';
import { bubbleVariants } from './MessageBubble.variants';

const MessageContent = dynamic(
  () => import('../MessageContent/MessageContent').then((m) => ({ default: m.MessageContent })),
  { ssr: false }
);

export const MessageBubble = () => {
  const { attachment, isOwn, isTail } = useChatMessage();

  const isBareImage = attachment ? isImageMime(attachment.mime) : false;

  return (
    <MessageContextMenu>
      <div
        className={bubbleVariants({
          owner: isOwn ? 'own' : 'other',
          display: isBareImage ? 'bare' : 'padded',
          tail: isTail
        })}
      >
        {attachment ? <MessageAttachment attachment={attachment} /> : <MessageContent />}
      </div>
    </MessageContextMenu>
  );
};
