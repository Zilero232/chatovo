import { Row, Text } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { Phone } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { formatDateTime } from '@/shared/lib';

import type { RoomMessageItemProps } from './RoomMessageItem.types';

import { AdminMessageBody } from '../../../../../AdminMessageBody/AdminMessageBody';

import s from './RoomMessageItem.module.scss';

export const RoomMessageItem = ({ message }: RoomMessageItemProps) => {
  const t = useTranslations('admin');

  const isCall = message.kind === 'call';

  return (
    <article className={clsx(s.root, message.deletedAt && s.deleted)}>
      <Row align='center' gap='2'>
        <Text truncate size='sm' weight='medium'>
          {message.senderName ?? t('rooms.unknownSender')}
        </Text>

        <Text size='xs' tone='muted'>
          {formatDateTime(message.createdAt)}
          {message.editedAt && ` · ${t('users.edited')}`}
          {message.deletedAt && ` · ${t('users.deletedMessage')}`}
        </Text>
      </Row>

      {isCall ? (
        <Row align='center' gap='2'>
          <Phone className={s.icon} />
          <Text size='sm' tone='muted'>
            {t('rooms.call')}
          </Text>
        </Row>
      ) : (
        <AdminMessageBody body={message.body} />
      )}
    </article>
  );
};
