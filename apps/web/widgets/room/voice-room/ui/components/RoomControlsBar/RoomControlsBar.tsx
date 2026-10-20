'use client';

import { clsx } from 'clsx';

import { RoomControlBar } from '@/features/room/room-control';
import { MusicButton } from '@/features/room/room-music';
import { SoundboardButton } from '@/features/room/soundboard';

import type { RoomControlsBarProps } from './RoomControlsBar.types';

import { RoomInviteButton } from '../RoomInviteButton/RoomInviteButton';
import { VoiceRoomChatButton } from '../VoiceRoomChatButton/VoiceRoomChatButton';

import s from '../../VoiceRoom.module.scss';

export const RoomControlsBar = ({ isDm, isChatOpen, onToggleChat }: RoomControlsBarProps) => (
  <div className={clsx(s.controls, 'surface-bar')}>
    <span aria-hidden className='accent-top-line' />
    <div className={s.controlBarWrap}>
      <RoomControlBar
        extraActions={
          <>
            <MusicButton />
            <SoundboardButton />
          </>
        }
      />
    </div>

    <div className={s.sideActions}>
      {!isDm && (
        <div className={s.desktopInvite}>
          <RoomInviteButton />
        </div>
      )}
      <VoiceRoomChatButton isOpen={isChatOpen} onToggle={onToggleChat} />
    </div>
  </div>
);
