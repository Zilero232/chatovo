'use client';

import type { LocalParticipant } from 'livekit-client';

import { useUnmount } from '@siberiacancode/reactuse';
import { useRef, useState } from 'react';
import { isNullish } from 'remeda';

import { isCancelled } from '../../lib/media-errors';

const PENDING_VISIBLE_AFTER_MS = 250;

export type ParticipantAction = {
  isPending: boolean;
  run: () => Promise<void>;
};

export type UseParticipantActionInput = {
  action: (participant: LocalParticipant) => Promise<unknown>;
  participant: LocalParticipant | undefined;
};

export const useParticipantAction = ({
  participant,
  action
}: UseParticipantActionInput): ParticipantAction => {
  const [isPending, setIsPending] = useState(false);
  const isRunningRef = useRef(false);
  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useUnmount(() => {
    if (revealTimeoutRef.current) {
      clearTimeout(revealTimeoutRef.current);
    }
  });

  const run = async () => {
    if (isNullish(participant) || isRunningRef.current) {
      return;
    }

    isRunningRef.current = true;

    revealTimeoutRef.current = setTimeout(() => {
      if (isRunningRef.current) {
        setIsPending(true);
      }
    }, PENDING_VISIBLE_AFTER_MS);

    try {
      await action(participant);
    } catch (err) {
      if (!isCancelled(err)) {
        console.error('room control action failed', err);
      }
    } finally {
      isRunningRef.current = false;

      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current);
        revealTimeoutRef.current = null;
      }

      setIsPending(false);
    }
  };

  return { run, isPending };
};
