import { Spinner } from '@chatovo/ui-kit';

import { useFriendshipRelation } from '@/entities/social/friend';

import type { FriendProfileActionsProps } from './FriendProfileActions.types';

import { FriendProfileActionsBody } from './FriendProfileActionsBody';

import s from './FriendProfileActions.module.scss';

export const FriendProfileActions = ({
  userId,
  friendTag,
  onOpenChat,
  renderRemoveConfirm
}: FriendProfileActionsProps) => {
  const { data: relation, isPending: isRelationPending } = useFriendshipRelation(userId);

  if (isRelationPending) {
    return (
      <div className={s.root}>
        <Spinner size='sm' />
      </div>
    );
  }

  return (
    <div className={s.root}>
      <FriendProfileActionsBody
        friendTag={friendTag}
        renderRemoveConfirm={renderRemoveConfirm}
        state={relation ?? { status: 'none' }}
        userId={userId}
        onOpenChat={onOpenChat}
      />
    </div>
  );
};
