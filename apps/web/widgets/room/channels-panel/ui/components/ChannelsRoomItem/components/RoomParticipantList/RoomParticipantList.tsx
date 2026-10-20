'use client';

import { AnimatePresence, motion } from 'motion/react';
import { isEmpty } from 'remeda';

import type { RoomParticipantListProps } from './RoomParticipantList.types';

import {
  PARTICIPANTS_ANIMATE,
  PARTICIPANTS_EXIT,
  PARTICIPANTS_INITIAL,
  PARTICIPANTS_TRANSITION
} from '../../ChannelsRoomItem.motion';
import { RoomParticipantEntry } from '../RoomParticipantEntry/RoomParticipantEntry';

import s from '../../ChannelsRoomItem.module.scss';

export const RoomParticipantList = ({ ownerId, participants }: RoomParticipantListProps) => (
  <AnimatePresence initial={false}>
    {!isEmpty(participants) && (
      <motion.div
        animate={PARTICIPANTS_ANIMATE}
        className={s.participantsWrap}
        exit={PARTICIPANTS_EXIT}
        initial={PARTICIPANTS_INITIAL}
        transition={PARTICIPANTS_TRANSITION}
      >
        <div className={s.participants}>
          {participants.map((participant) => (
            <RoomParticipantEntry
              key={participant.identity}
              isOwner={participant.identity === ownerId}
              participant={participant}
            />
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
