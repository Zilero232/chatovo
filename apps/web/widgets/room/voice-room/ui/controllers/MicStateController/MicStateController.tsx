'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { useEffect, useEffectEvent } from 'react';

import { useRealtime } from '@/entities/app/realtime';

import { useCurrentRoomId } from '../../../model/hooks';

export const MicStateController = () => {
  const roomId = useCurrentRoomId();
  const { send } = useRealtime();
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();

  const push = useEffectEvent(() => {
    send({ op: 'presence.patch', roomId, micMuted: !isMicrophoneEnabled });
  });

  useEffect(() => {
    if (!localParticipant) {
      return;
    }

    push();
  }, [localParticipant, isMicrophoneEnabled]);

  return null;
};
