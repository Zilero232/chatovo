'use client';

import { useState } from 'react';
import { match } from 'ts-pattern';

import type { FriendProfileActionsBodyProps } from './FriendProfileActionsBody.types';

import { useFriendProfileActions } from '../../model/hooks';
import {
  AddFriendAction,
  CancelRequestAction,
  FriendActions,
  IncomingRequestActions
} from './components';

export const FriendProfileActionsBody = ({
  state,
  userId,
  friendTag,
  onOpenChat,
  renderRemoveConfirm
}: FriendProfileActionsBodyProps) => {
  const [removeOpen, setRemoveOpen] = useState(false);

  const { isBusy, add, cancelRequest, accept, decline, call } = useFriendProfileActions({
    userId,
    friendTag
  });

  return (
    <>
      {match(state)
        .with({ status: 'none' }, () => <AddFriendAction isBusy={isBusy} onAdd={add} />)
        .with({ status: 'outgoing_pending' }, () => (
          <CancelRequestAction isBusy={isBusy} onCancel={cancelRequest} />
        ))
        .with({ status: 'incoming_pending' }, ({ friendshipId }) => (
          <IncomingRequestActions
            isBusy={isBusy}
            onAccept={() => accept(friendshipId)}
            onDecline={() => decline(friendshipId)}
          />
        ))
        .with({ status: 'friends' }, () => (
          <FriendActions
            isBusy={isBusy}
            onCall={call}
            onOpenChat={onOpenChat}
            onRemove={() => setRemoveOpen(true)}
          />
        ))
        .exhaustive()}

      {renderRemoveConfirm({ open: removeOpen, onOpenChange: setRemoveOpen })}
    </>
  );
};
