import { useEffect, useEffectEvent, useRef } from 'react';
import { toast } from 'sonner';

import { useRoomSession } from '@/entities/room/session';
import {
  DM_CALL_TIMING,
  resolveCallOutcome,
  useCallOutcomeText,
  useCallTone,
  useDmCalls
} from '@/entities/social/dm-call';

export const useDmCallSessionSync = (leave: (roomId: string) => void) => {
  const { session } = useRoomSession();
  const { current } = useDmCalls();
  const playTone = useCallTone();
  const outcomeText = useCallOutcomeText();

  const dmRoomIdRef = useRef<string | null>(null);
  const boundCallIdRef = useRef<string | null>(null);

  const sessionRoomId = session?.isDm ? session.roomId : null;

  const callId = current?.id ?? null;
  const isEnded = current?.state === 'ended';

  const finish = useEffectEvent(() => {
    if (!current || current.roomId !== (sessionRoomId ?? dmRoomIdRef.current)) {
      return null;
    }

    const isBusy = resolveCallOutcome(current) === 'busy';

    playTone(isBusy ? 'busy' : 'ended');
    toast.info(outcomeText(current), { id: `dm-call-ended-${current.id}` });

    if (sessionRoomId !== current.roomId) {
      return null;
    }

    const { roomId } = current;

    return setTimeout(leave, DM_CALL_TIMING.endedVisibleMs, roomId);
  });

  useEffect(() => {
    if (!isEnded) {
      return;
    }

    const timer = finish();

    return () => {
      if (timer !== null) {
        clearTimeout(timer);
      }
    };
  }, [callId, isEnded]);

  const syncBinding = useEffectEvent(() => {
    if (sessionRoomId === null) {
      boundCallIdRef.current = null;

      return;
    }

    dmRoomIdRef.current = sessionRoomId;

    if (current?.roomId === sessionRoomId) {
      boundCallIdRef.current = current.id;

      return;
    }

    if (boundCallIdRef.current !== null) {
      boundCallIdRef.current = null;
      leave(sessionRoomId);
    }
  });

  useEffect(() => {
    syncBinding();
  }, [callId, sessionRoomId]);

  const isCallEnding = (roomId: string) => current?.roomId === roomId && isEnded;

  return { isCallEnding };
};
