import { clsx } from 'clsx';
import { lazy, Suspense } from 'react';
import { isNullish } from 'remeda';

import { env } from '@/shared/config';

import { useInvisibleModeSync, useRoomModerationNotices, useRoomSessionHost } from '../model/hooks';
import { MiniRoomFloatingSlot } from './components';

import s from './RoomSessionHost.module.scss';

const VoiceRoom = lazy(async () =>
  import('@/widgets/room/voice-room').then((m) => ({ default: m.VoiceRoom }))
);

export const RoomSessionHost = () => {
  const { session, isExpanded, expand, failConnection, leave } = useRoomSessionHost();

  useInvisibleModeSync();
  useRoomModerationNotices(leave);

  if (isNullish(session)) {
    return null;
  }

  const { roomId, roomName, token, isChatOpen, isDm, isInvisible } = session;

  return (
    <div className={clsx(s.root, isExpanded ? s.expanded : s.minimized)}>
      <MiniRoomFloatingSlot />

      <Suspense fallback={null}>
        <VoiceRoom
          key={`${roomId}:${isInvisible}`}
          initialChatOpen={isChatOpen}
          isDm={isDm}
          isMinimized={!isExpanded}
          roomId={roomId}
          roomName={roomName}
          serverUrl={env.NEXT_PUBLIC_LIVEKIT_URL}
          token={token}
          onConnectFailure={() => failConnection(roomId)}
          onExpand={() => expand(roomId)}
          onLeave={() => leave(roomId)}
        />
      </Suspense>
    </div>
  );
};
