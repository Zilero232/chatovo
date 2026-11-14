import { Text } from '@chatovo/ui-kit';
import { useTranslations } from 'use-intl';

import { formatDateTime } from '@/shared/lib';

import type { MessageItemProps } from './MessageItem.types';

import { AdminMessageBody } from '../../../../../../../AdminMessageBody/AdminMessageBody';

import s from './MessageItem.module.scss';

export const MessageItem = ({ message }: MessageItemProps) => {
  const t = useTranslations('admin');

  return (
    <article className={s.root}>
      <AdminMessageBody body={message.body} />

      <Text size='xs' tone='muted'>
        {message.roomName ?? message.roomId} · {formatDateTime(message.createdAt)}
        {message.editedAt && ` · ${t('users.edited')}`}
        {message.deletedAt && ` · ${t('users.deletedMessage')}`}
      </Text>
    </article>
  );
};
