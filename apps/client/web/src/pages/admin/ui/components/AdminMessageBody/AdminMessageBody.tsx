import { decodeChatAttachment, isImageMime } from '@chatovo/schemas';
import { Row, Text } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { FileText, Image as ImageIcon } from 'lucide-react';
import prettyBytes from 'pretty-bytes';

import type { AdminMessageBodyProps } from './AdminMessageBody.types';

import s from './AdminMessageBody.module.scss';

export const AdminMessageBody = ({ body, className }: AdminMessageBodyProps) => {
  const attachment = decodeChatAttachment(body);

  if (!attachment) {
    return (
      <Text className={clsx(s.body, className)} size='sm'>
        {body}
      </Text>
    );
  }

  return (
    <Row align='center' className={s.attachment} gap='2'>
      {isImageMime(attachment.mime) ? (
        <ImageIcon className={s.icon} />
      ) : (
        <FileText className={s.icon} />
      )}

      <a className={s.link} href={attachment.url} rel='noopener noreferrer' target='_blank'>
        {attachment.name}
      </a>

      <Text size='xs' tone='muted'>
        {prettyBytes(attachment.size)}
      </Text>
    </Row>
  );
};
