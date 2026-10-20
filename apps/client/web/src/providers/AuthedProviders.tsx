import type { ReactNode } from 'react';

import { RealtimeProvider } from '@/entities/app/realtime';
import { RoomMusicRealtimeSync } from '@/entities/room/music';
import { LeaveSoundProvider, RoomsRealtimeSync } from '@/entities/room/room';
import { MiniRoomSlotProvider, RoomSessionProvider } from '@/entities/room/session';
import { FriendsRealtimeSync } from '@/entities/social/friend';
import { PushRegistration } from '@/features/app/push-notifications';
import { FriendChatProvider } from '@/features/social/friend-chat';
import { ChatRealtimeSync } from '@/widgets/chat/chat-panel';

import { DeepLinkProvider } from './DeepLinkProvider';
import { ShortcutsProvider } from './ShortcutsProvider';
import { UpdateProvider } from './UpdateProvider';

export const AuthedProviders = ({ children }: { children: ReactNode }) => (
  <ShortcutsProvider>
    <UpdateProvider>
      <DeepLinkProvider>
        <RealtimeProvider>
          <RoomSessionProvider>
            <MiniRoomSlotProvider>
              <FriendChatProvider>
                <PushRegistration />
                <FriendsRealtimeSync />
                <RoomsRealtimeSync />
                <RoomMusicRealtimeSync />
                <ChatRealtimeSync />
                <LeaveSoundProvider>{children}</LeaveSoundProvider>
              </FriendChatProvider>
            </MiniRoomSlotProvider>
          </RoomSessionProvider>
        </RealtimeProvider>
      </DeepLinkProvider>
    </UpdateProvider>
  </ShortcutsProvider>
);
