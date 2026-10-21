import { clsx } from 'clsx';

import { RoomControlBar } from '@/features/room/room-control';
import { MusicButton } from '@/features/room/room-music';

import type { RoomControlsBarProps } from './RoomControlsBar.types';

import { VoiceRoomChatButton } from '../VoiceRoomChatButton/VoiceRoomChatButton';

import s from '../../VoiceRoom.module.scss';

export const RoomControlsBar = ({ isChatOpen, onToggleChat }: RoomControlsBarProps) => (
  <div className={clsx(s.controls, 'surface-bar')}>
    <span aria-hidden className='accent-top-line' />
    <div className={s.controlBarWrap}>
      <RoomControlBar extraActions={<MusicButton />} />
    </div>

    <div className={s.sideActions}>
      <VoiceRoomChatButton isOpen={isChatOpen} onToggle={onToggleChat} />
    </div>
  </div>
);
