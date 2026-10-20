'use client';

import type { ReactNode } from 'react';

import { createContextHook } from '@siberiacancode/reactuse';
import { useState } from 'react';

import type { RoomSession, RoomSessionValue } from './room-session-context.types';

const useRoomSessionValue = (): RoomSessionValue => {
  const [session, setSession] = useState<RoomSession | null>(null);
  const [leftRoomId, setLeftRoomId] = useState<string | null>(null);

  const isRecentlyLeft = (roomId: string) => leftRoomId === roomId;

  const open = (next: RoomSession) => {
    if (isRecentlyLeft(next.roomId)) {
      return;
    }

    setSession(next);
  };

  const close = (roomId?: string) => {
    if (roomId && session && session.roomId !== roomId) {
      return;
    }

    setLeftRoomId(roomId ?? session?.roomId ?? null);
    setSession(null);
  };

  const rejoin = () => {
    setLeftRoomId(null);
  };

  return { session, open, close, isRecentlyLeft, rejoin };
};

const { Provider, use } = createContextHook(useRoomSessionValue);

export const RoomSessionProvider = ({ children }: { children: ReactNode }) => (
  <Provider params={[]}>{children}</Provider>
);

export const useRoomSession = (): RoomSessionValue => {
  const value = use();

  if (!value) {
    throw new Error('useRoomSession must be used within RoomSessionProvider');
  }

  return value;
};
