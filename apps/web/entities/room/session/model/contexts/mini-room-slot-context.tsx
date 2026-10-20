'use client';

import type { ReactNode } from 'react';

import { createContextHook } from '@siberiacancode/reactuse';
import { useState } from 'react';

import type { MiniRoomSlotVariant } from '../types';

const useMiniRoomSlotState = () => {
  const [dockedSlot, setDockedSlot] = useState<HTMLElement | null>(null);
  const [floatingSlot, setFloatingSlot] = useState<HTMLElement | null>(null);

  const slot = dockedSlot ?? floatingSlot;
  const variant: MiniRoomSlotVariant = dockedSlot ? 'docked' : 'floating';

  return { slot, variant, setDockedSlot, setFloatingSlot };
};

const { Provider, use } = createContextHook(useMiniRoomSlotState);

export const MiniRoomSlotProvider = ({ children }: { children: ReactNode }) => (
  <Provider params={[]}>{children}</Provider>
);

export const useMiniRoomSlot = () => {
  const value = use();

  if (!value) {
    throw new Error('useMiniRoomSlot must be used within MiniRoomSlotProvider');
  }

  return value;
};
