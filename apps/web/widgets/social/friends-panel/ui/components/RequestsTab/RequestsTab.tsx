import type { FriendRequestEntry } from '@chatovo/schemas';

import { CenteredState, Spinner } from '@chatovo/ui-kit';
import { AnimatePresence, motion } from 'motion/react';
import { isEmpty } from 'remeda';
import { match, P } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import { useToastError } from '@/entities/app/locale';
import {
  useAcceptFriendRequest,
  useDeclineFriendRequest,
  useIncomingFriendRequests
} from '@/entities/social/friend';
import {
  LIST_ITEM_ANIMATE,
  LIST_ITEM_EXIT,
  LIST_ITEM_INITIAL,
  LIST_ITEM_TRANSITION
} from '@/shared/config';

import { FriendRequestListItem } from './FriendRequestListItem/FriendRequestListItem';

import s from '../../FriendsPanel.module.scss';

const hasRequests = (
  requests: FriendRequestEntry[] | undefined
): requests is FriendRequestEntry[] => !isEmpty(requests ?? []);

export const RequestsTab = () => {
  const t = useTranslations('friends');
  const toastError = useToastError();

  const { data: requests, isPending } = useIncomingFriendRequests();
  const acceptRequest = useAcceptFriendRequest();
  const declineRequest = useDeclineFriendRequest();

  return match({ isPending, requests })
    .with({ isPending: true }, () => <Spinner className={s.spinner} />)
    .with({ requests: P.when(hasRequests) }, ({ requests: items }) => (
      <>
        <p className={s.countLabel}>{t('pendingCount', { count: items.length })}</p>

        <div className={s.list}>
          <AnimatePresence initial={false} mode='popLayout'>
            {items.map((entry) => (
              <motion.div
                key={entry.friendshipId}
                animate={LIST_ITEM_ANIMATE}
                exit={LIST_ITEM_EXIT}
                initial={LIST_ITEM_INITIAL}
                layout='position'
                transition={LIST_ITEM_TRANSITION}
              >
                <FriendRequestListItem
                  entry={entry}
                  isAccepting={acceptRequest.isPending}
                  isDeclining={declineRequest.isPending}
                  onAccept={() => {
                    acceptRequest.mutate(
                      { friendshipId: entry.friendshipId, userId: entry.user.id },
                      {
                        onError: (err: Error) =>
                          toastError(`friend-request-accept-${entry.user.id}`)(err)
                      }
                    );
                  }}
                  onDecline={() => {
                    declineRequest.mutate(
                      { friendshipId: entry.friendshipId, userId: entry.user.id },
                      {
                        onError: (err: Error) =>
                          toastError(`friend-request-decline-${entry.user.id}`)(err)
                      }
                    );
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </>
    ))
    .otherwise(() => (
      <CenteredState
        className={s.empty}
        description={t('emptyRequestsHint')}
        pattern='dots'
        size='sm'
        title={t('emptyRequestsTitle')}
      />
    ));
};
