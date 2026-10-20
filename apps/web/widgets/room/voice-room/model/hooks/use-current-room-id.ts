'use client';

import { useRoomContext } from '@livekit/components-react';

import { useActiveVoiceRoomId } from '@/entities/room/session';

export const useCurrentRoomId = () => {
  const sessionRoomId = useActiveVoiceRoomId();
  const livekitRoomId = useRoomContext().name;

  return livekitRoomId || sessionRoomId || '';
};
