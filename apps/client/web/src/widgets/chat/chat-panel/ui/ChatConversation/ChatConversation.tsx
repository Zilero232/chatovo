import type { Ref } from 'react';

import { Spinner } from '@chatovo/ui-kit';
import { Paperclip } from 'lucide-react';
import { match } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import type { ChatConversationProps } from './ChatConversation.types';

import { useChatConversation } from '../../model/hooks';
import {
  ChatComposer,
  ChatEmpty,
  ChatLines,
  ChatLoadingSkeleton,
  ChatReadOnlyNotice
} from '../components';

import s from './ChatConversation.module.scss';

export const ChatConversation = ({
  roomId,
  currentUserId,
  canModerate = false,
  enabled = true,
  peerId
}: ChatConversationProps) => {
  const t = useTranslations('chat');

  const {
    lines,
    listRef,
    sentinelRef,
    files,
    actions,
    isPending,
    isReadOnly,
    isEmpty,
    hasOlder,
    isLoadingOlder
  } = useChatConversation({ roomId, currentUserId, enabled });

  return (
    <div ref={files.dropRef as Ref<HTMLDivElement>} className={s.root}>
      {files.overed && !isReadOnly && (
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

              <ChatLines
                actions={actions}
                canModerate={canModerate}
                isReadOnly={isReadOnly}
                lines={lines}
                peerId={peerId ?? null}
              />
            </div>
          ))}
      </div>

      {isReadOnly ? (
        <ChatReadOnlyNotice />
      ) : (
        <ChatComposer
          isUploading={files.isUploading}
          onAttach={files.openPicker}
          onPaste={files.onPaste}
          onSend={actions.send}
        />
      )}
    </div>
  );
};
