import { useDeafen } from '@/features/room/room-control';
import { RoomMusicProvider } from '@/features/room/room-music';

import type { RoomMusicScopeProps } from './RoomMusicScope.types';

export const RoomMusicScope = ({ roomId, children }: RoomMusicScopeProps) => {
  const { isDeafened } = useDeafen();

  return (
    <RoomMusicProvider isDeafened={isDeafened} roomId={roomId}>
      {children}
    </RoomMusicProvider>
  );
};
