'use client';

import type { Ref } from 'react';

import { Spinner } from '@chatovo/ui-kit';
import { Paperclip } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react';
import { match } from 'ts-pattern';

import type { ChatConversationProps } from './ChatConversation.types';

import { useChatConversation } from '../../model/hooks';
import {
  ChatComposer,
  ChatEmpty,
  ChatLoadingSkeleton,
  ChatMessageItem,
  DateDivider
} from '../components';

import s from './ChatConversation.module.scss';

export const ChatConversation = ({
  roomId,
  currentUserId,
  enabled = true
}: ChatConversationProps) => {
  const t = useTranslations('chat');

  const {
    lines,
    listRef,
    sentinelRef,
    files,
    actions,
    isPending,
    isEmpty,
    hasOlder,
    isLoadingOlder
  } = useChatConversation({ roomId, currentUserId, enabled });

  return (
    <div ref={files.dropRef as Ref<HTMLDivElement>} className={s.root}>
      {files.overed && (
        <div className={s.dropOverlay}>
          <Paperclip className={s.dropIcon} />
          {t('dropToSend')}
        </div>
      )}

      <div ref={listRef} className={s.scroll}>
        {match({ isPending, isEmpty })
          .with({ isPending: true }, () => <ChatLoadingSkeleton />)
          .with({ isEmpty: true }, () => <ChatEmpty />)
          .otherwise(() => (
            <div className={s.list}>
              {hasOlder && <div ref={sentinelRef} className={s.topSentinel} />}

              {isLoadingOlder && (
                <div className={s.olderLoader}>
                  <Spinner />
                </div>
              )}

              {lines.map(({ line, isOwn, isGrouped, isTail, showDivider }) => (
                <Fragment key={line.id}>
                  {showDivider && <DateDivider timestamp={line.timestamp} />}
                  <ChatMessageItem
                    canManage={isOwn}
                    isGrouped={isGrouped}
                    isOwn={isOwn}
                    isTail={isTail}
                    message={line}
                    onDelete={actions.remove}
                    onDiscard={actions.discard}
                    onEdit={actions.edit}
                    onRetry={actions.retry}
                  />
                </Fragment>
              ))}
            </div>
          ))}
      </div>

      <ChatComposer
        isUploading={files.isUploading}
        onAttach={files.openPicker}
        onPaste={files.onPaste}
        onSend={actions.send}
      />
    </div>
  );
};
