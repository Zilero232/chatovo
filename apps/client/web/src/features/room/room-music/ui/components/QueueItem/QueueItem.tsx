import { motion } from 'motion/react';

import {
  LIST_ITEM_ANIMATE,
  LIST_ITEM_EXIT,
  LIST_ITEM_INITIAL,
  LIST_ITEM_TRANSITION
} from '@/shared/config';

import type { QueueItemProps } from './QueueItem.types';

import { TrackArtwork } from '../TrackArtwork/TrackArtwork';

import s from './QueueItem.module.scss';

export const QueueItem = ({ action, caption, track }: QueueItemProps) => (
  <motion.li
    layout
    animate={LIST_ITEM_ANIMATE}
    className={s.root}
    exit={LIST_ITEM_EXIT}
    initial={LIST_ITEM_INITIAL}
    transition={LIST_ITEM_TRANSITION}
  >
    <TrackArtwork size='sm' track={track} />
    <span className={s.meta}>
      <span className={s.title}>{track.title}</span>
      <span className={s.caption}>{caption}</span>
    </span>
    {action}
  </motion.li>
);
