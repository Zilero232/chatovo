'use client';

import { AnimatePresence, motion } from 'motion/react';

import {
  LIST_ITEM_ANIMATE,
  LIST_ITEM_EXIT,
  LIST_ITEM_INITIAL,
  LIST_ITEM_TRANSITION
} from '@/shared/config';

import type { FriendsListProps } from './FriendsList.types';

import { FriendListItem } from '../FriendListItem/FriendListItem';

import s from '../../FriendsPanel.module.scss';

export const FriendsList = ({
  countLabel,
  items,
  getUnread,
  onOpen,
  onRemove
}: FriendsListProps) => (
  <>
    <p className={s.countLabel}>{countLabel}</p>

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
            <FriendListItem
              dmUnread={getUnread(entry.user.id)}
              user={entry.user}
              onOpen={onOpen}
              onRemove={onRemove}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  </>
);
