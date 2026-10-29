import { clsx } from 'clsx';
import { lazy, Suspense } from 'react';
import { isNullish } from 'remeda';

import { env } from '@/shared/config';

import {
  useDmCallRejoinPrompt,
  useDmCallSessionSync,
  useInvisibleModeSync,
  useRoomModerationNotices,
  useRoomSessionHost
} from '../model/hooks';
import { InvisiblePasswordDialog, MiniRoomFloatingSlot } from './components';

import s from './RoomSessionHost.module.scss';

const VoiceRoom = lazy(async () =>
  import('@/widgets/room/voice-room').then((m) => ({ default: m.VoiceRoom }))
);

export const RoomSessionHost = () => {
  const { session, isExpanded, expand, failConnection, leave } = useRoomSessionHost();

  const { passwordPrompt } = useInvisibleModeSync();
  useRoomModerationNotices(leave);
  const { isCallEnding } = useDmCallSessionSync(leave);
  useDmCallRejoinPrompt();

  if (isNullish(session)) {
    return null;
  }

  const { roomId, roomName, token, isChatOpen, isDm, isInvisible } = session;

  return (
    <div className={clsx(s.root, isExpanded ? s.expanded : s.minimized)}>
      <MiniRoomFloatingSlot />

      {passwordPrompt && (
        <InvisiblePasswordDialog
          isPending={passwordPrompt.isPending}
          isWrong={passwordPrompt.isWrong}
          roomName={passwordPrompt.roomName}
          onCancel={passwordPrompt.cancel}
          onSubmit={passwordPrompt.submit}
        />
      )}

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
          onConnectFailure={() => !isCallEnding(roomId) && failConnection(roomId)}
          onExpand={() => expand(roomId)}
          onLeave={(options) => !isCallEnding(roomId) && leave(roomId, options)}
        />
      </Suspense>
    </div>
  );
};
