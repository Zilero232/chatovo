'use client';

import type { ReactNode } from 'react';

import { createContextHook } from '@siberiacancode/reactuse';
import { useEffect, useRef, useState } from 'react';

import { useRealtime, useRealtimeMessage } from '@/entities/app/realtime';
import { useCurrentUser } from '@/entities/auth/user';
import { appEvents } from '@/shared/lib';

export type FloatingReaction = {
  emoji: string;
  id: number;
  offset: number;
};

const REACTION_LIFETIME = 6000;

const useReactionsState = (roomId: string) => {
  const { send } = useRealtime();
  const { user } = useCurrentUser();
  const userId = user?.id ?? null;

  const [reactions, setReactions] = useState<FloatingReaction[]>([]);
  const nextIdRef = useRef(0);
  const timeoutsRef = useRef(new Set<ReturnType<typeof setTimeout>>());

  useEffect(
    () => () => {
      for (const timeout of timeoutsRef.current) {
        clearTimeout(timeout);
      }

      timeoutsRef.current.clear();
    },
    []
  );

  const addReaction = (emoji: string) => {
    const id = nextIdRef.current++;

    appEvents.emit.reaction();

    setReactions((prev) => [...prev, { id, emoji, offset: (id % 4) * 6 }]);

    const timeout = setTimeout(() => {
      timeoutsRef.current.delete(timeout);
      setReactions((prev) => prev.filter((reaction) => reaction.id !== id));
    }, REACTION_LIFETIME);

    timeoutsRef.current.add(timeout);
  };

  useRealtimeMessage((message) => {
    if (message.type !== 'room.reaction') {
      return;
    }

    if (message.roomId !== roomId || message.senderId === userId) {
      return;
    }

    addReaction(message.emoji);
  });

  const sendReaction = (emoji: string) => {
    addReaction(emoji);
    send({ op: 'room.reaction', roomId, emoji });
  };

  return { reactions, send: sendReaction };
};

const { Provider, use } = createContextHook(useReactionsState);

export const ReactionsProvider = ({
  roomId,
  children
}: {
  roomId: string;
  children: ReactNode;
}) => <Provider params={[roomId]}>{children}</Provider>;

export const useReactions = () => {
  const value = use();

  if (!value) {
    throw new Error('useReactions must be used within ReactionsProvider');
  }

  return value;
};
