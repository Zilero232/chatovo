'use client';

import { Radio } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import {
  LIST_ITEM_ANIMATE,
  LIST_ITEM_EXIT,
  LIST_ITEM_INITIAL,
  LIST_ITEM_TRANSITION
} from '@/shared/config';

import type { ActivityRoomsProps } from './ActivityRooms.types';

import { ActivityRoomCard } from '../ActivityRoomCard/ActivityRoomCard';

import s from './ActivityRooms.module.scss';

export const ActivityRooms = ({ groups, onNavigate }: ActivityRoomsProps) => {
  const t = useTranslations('channels.activity');

  return (
    <div className={s.root}>
      <p className={s.label}>
        <Radio className={s.icon} />
        {t('inRooms')}
      </p>

      <div className={s.cards}>
        <AnimatePresence initial={false} mode='popLayout'>
          {groups.map((group) => (
            <motion.div
              key={group.roomId}
              animate={LIST_ITEM_ANIMATE}
              exit={LIST_ITEM_EXIT}
              initial={LIST_ITEM_INITIAL}
              layout='position'
              transition={LIST_ITEM_TRANSITION}
            >
              <ActivityRoomCard group={group} onNavigate={onNavigate} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
