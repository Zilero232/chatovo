import type { UserBlockEntry } from '@chatovo/schemas';

import { CenteredState, Spinner } from '@chatovo/ui-kit';
import { AnimatePresence, motion } from 'motion/react';
import { isEmpty } from 'remeda';
import { match, P } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import { useBlockedUsers } from '@/entities/social/friend';
import { useUnblockUser } from '@/features/social/block-user';
import {
  LIST_ITEM_ANIMATE,
  LIST_ITEM_EXIT,
  LIST_ITEM_INITIAL,
  LIST_ITEM_TRANSITION
} from '@/shared/config';

import { BlockedListItem } from './BlockedListItem/BlockedListItem';

import s from '../../FriendsPanel.module.scss';

const hasEntries = (entries: UserBlockEntry[] | undefined): entries is UserBlockEntry[] =>
  !isEmpty(entries ?? []);

export const BlockedTab = () => {
  const t = useTranslations('blocks');

  const { data: entries, isPending } = useBlockedUsers();
  const { isPending: isUnblocking, unblock } = useUnblockUser();

  return match({ isPending, entries })
    .with({ isPending: true }, () => <Spinner className={s.spinner} />)
    .with({ entries: P.when(hasEntries) }, ({ entries: items }) => (
      <>
        <p className={s.countLabel}>{t('count', { count: items.length })}</p>

        <div className={s.list}>
          <AnimatePresence initial={false} mode='popLayout'>
            {items.map(({ user }) => (
              <motion.div
                key={user.id}
                animate={LIST_ITEM_ANIMATE}
                exit={LIST_ITEM_EXIT}
                initial={LIST_ITEM_INITIAL}
                layout='position'
                transition={LIST_ITEM_TRANSITION}
              >
                <BlockedListItem
                  isBusy={isUnblocking}
                  user={user}
                  onUnblock={() => unblock({ userId: user.id, userName: user.name })}
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
        description={t('emptyHint')}
        pattern='dots'
        size='sm'
        title={t('emptyTitle')}
      />
    ));
};
