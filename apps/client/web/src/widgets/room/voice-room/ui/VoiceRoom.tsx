import { LiveKitRoom } from '@livekit/components-react';
import { clsx } from 'clsx';
import { setLogLevel } from 'livekit-client';

import { useMiniRoomSlot } from '@/entities/room/session';
import { DeafenProvider, ReactionsProvider, RoomAudio } from '@/features/room/room-control';
import { RoomMusicLayer } from '@/features/room/room-music';

import type { VoiceRoomProps } from './VoiceRoom.types';

import { LocalSpeakingProvider } from '../model/contexts';
import { useChatToggle, useRoomConnection } from '../model/hooks';
import { ExpandedRoomView, MiniRoomHost, RoomHeader, RoomMusicScope } from './components';
import { RoomControllers } from './controllers';

import s from './VoiceRoom.module.scss';

setLogLevel('error');

export const VoiceRoom = ({
  roomId,
  roomName,
  serverUrl,
  token,
  initialChatOpen = false,
  isDm = false,
  isMinimized = false,
  onConnectFailure,
  onExpand,
  onLeave
}: VoiceRoomProps) => {
  const { slot, variant: miniVariant } = useMiniRoomSlot();

  const { isChatOpen, toggleChat } = useChatToggle(initialChatOpen);

  const { audioCapture, publishDefaults, handleConnected, handleDisconnected } = useRoomConnection({
    roomId,
    token,
    onConnectFailure,
    onLeave
  });

  return (
    <div className={clsx(s.root, isMinimized && s.rootMinimized)}>
      <div className={clsx(s.frame, isMinimized && s.frameMinimized)}>
        <LiveKitRoom
          connect
          audio={audioCapture}
          className={clsx(s.room, isMinimized ? s.roomMinimized : isChatOpen && s.roomChatOpen)}
          options={{ webAudioMix: true, publishDefaults }}
          serverUrl={serverUrl}
          token={token}
          video={false}
          onConnected={handleConnected}
          onDisconnected={handleDisconnected}
        >
          <LocalSpeakingProvider>
            <DeafenProvider>
              <RoomMusicScope roomId={roomId}>
                <ReactionsProvider roomId={roomId}>
                  {!isMinimized && <RoomHeader name={roomName} />}

                  <RoomMusicLayer isMinimized={isMinimized} />

                  {isMinimized ? (
                    <MiniRoomHost
                      isDm={isDm}
                      roomName={roomName}
                      slot={slot}
                      variant={miniVariant}
                      onExpand={onExpand}
                    />
                  ) : (
                    <ExpandedRoomView
                      isChatOpen={isChatOpen}
                      isDm={isDm}
                      roomId={roomId}
                      roomName={roomName}
                      onToggleChat={toggleChat}
                    />
                  )}

                  <RoomAudio />
                  <RoomControllers roomName={roomName} />
                </ReactionsProvider>
              </RoomMusicScope>
            </DeafenProvider>
          </LocalSpeakingProvider>
        </LiveKitRoom>
      </div>
    </div>
  );
};
