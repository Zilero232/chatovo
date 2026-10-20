'use client';

import { createPortal } from 'react-dom';

import type { MiniRoomHostProps } from './MiniRoomHost.types';

import { MiniRoomBar } from '../MiniRoomBar/MiniRoomBar';

export const MiniRoomHost = ({ isDm, roomName, slot, onExpand }: MiniRoomHostProps) => {
  if (!slot) {
    return <MiniRoomBar isDm={isDm} roomName={roomName} variant='floating' onExpand={onExpand} />;
  }

  return createPortal(<MiniRoomBar isDm={isDm} roomName={roomName} onExpand={onExpand} />, slot);
};
