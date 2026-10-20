'use client';

import { useRoomSession } from '../contexts';

export const useActiveVoiceRoomId = (): string | null => {
  const { session } = useRoomSession();

  return session?.roomId ?? null;
};
