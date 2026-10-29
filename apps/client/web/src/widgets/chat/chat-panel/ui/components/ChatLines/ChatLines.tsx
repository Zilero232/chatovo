import { Fragment } from 'react';

import type { ChatLinesProps } from './ChatLines.types';

import { CallLogItem } from '../CallLogItem/CallLogItem';
import { ChatMessageItem } from '../ChatMessageItem/ChatMessageItem';
import { DateDivider } from '../DateDivider/DateDivider';

export const ChatLines = ({ actions, canModerate, isReadOnly, lines, peerId }: ChatLinesProps) =>
  lines.map(({ line, isOwn, isGrouped, isTail, showDivider }) => (
    <Fragment key={line.id}>
      {showDivider && <DateDivider timestamp={line.timestamp} />}

      {line.call ? (
        <CallLogItem call={line.call} peerId={peerId} timestamp={line.timestamp} />
      ) : (
        <ChatMessageItem
          canManage={isOwn || canModerate}
          isGrouped={isGrouped}
          isOwn={isOwn}
          isReadOnly={isReadOnly}
          isTail={isTail}
          message={line}
          onDelete={actions.remove}
          onDiscard={actions.discard}
          onEdit={actions.edit}
          onRetry={actions.retry}
        />
      )}
    </Fragment>
  ));
