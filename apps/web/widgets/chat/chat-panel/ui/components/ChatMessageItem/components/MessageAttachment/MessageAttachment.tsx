'use client';

import { isImageMime } from '@chatovo/schemas';
import { clsx } from 'clsx';
import { FileIcon } from 'lucide-react';
import prettyBytes from 'pretty-bytes';

import { handleExternalLinkClick } from '@/shared/lib';

import type { MessageAttachmentProps } from './MessageAttachment.types';

import { useChatMessage } from '../../../../../model/contexts';
import { AttachmentImage } from '../AttachmentImage/AttachmentImage';

import s from './MessageAttachment.module.scss';

export const MessageAttachment = ({ attachment }: MessageAttachmentProps) => {
  const { isOwn } = useChatMessage();

  const { url, name, size, mime } = attachment;

  if (isImageMime(mime)) {
    return <AttachmentImage attachment={attachment} />;
  }

  return (
    <a
      className={clsx(s.fileCard, { [s.fileCardOwn]: isOwn, [s.fileCardOther]: !isOwn })}
      download={name}
      href={url}
      rel='noopener noreferrer'
      target='_blank'
      onClick={(event) => handleExternalLinkClick({ event, url })}
    >
      <FileIcon className={s.fileIcon} />
      <span className={s.fileMeta}>
        <span className={s.fileName}>{name}</span>
        <span className={s.fileSize}>{prettyBytes(size)}</span>
      </span>
    </a>
  );
};
