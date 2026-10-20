'use client';

import { useGameActivitySync } from '@/features/app/game-activity';
import { useDeafenSync } from '@/features/room/room-control';

import {
  useCurrentRoomId,
  useDeviceSync,
  useMicActivationMode,
  useRestoreParticipantVolumes,
  useShortcutActions,
  useVoiceRoomSounds
} from '../../../model/hooks';
import { InvisibleNoticeController } from '../InvisibleNoticeController/InvisibleNoticeController';
import { LocalSpeakingController } from '../LocalSpeakingController/LocalSpeakingController';
import { MicStateController } from '../MicStateController/MicStateController';
import { RoomEasterEggsController } from '../RoomEasterEggsController/RoomEasterEggsController';
import { RoomRealtimeSubscribe } from '../RoomRealtimeSubscribe/RoomRealtimeSubscribe';
import { RoomTrayController } from '../RoomTrayController/RoomTrayController';

export const RoomControllers = () => {
  const roomId = useCurrentRoomId();

  useDeviceSync();
  useShortcutActions();
  useMicActivationMode();
  useVoiceRoomSounds(roomId);
  useRestoreParticipantVolumes();
  useDeafenSync();
  useGameActivitySync();

  return (
    <>
      <RoomRealtimeSubscribe />
      <RoomTrayController />
      <LocalSpeakingController />
      <MicStateController />
      <RoomEasterEggsController />
      <InvisibleNoticeController />
    </>
  );
};
