import { useGameActivitySync } from '@/features/app/game-activity';
import { useDeafenSync } from '@/features/room/room-control';

import type { RoomControllersProps } from './RoomControllers.types';

import {
  useCurrentRoomId,
  useDeviceSync,
  useMicActivationMode,
  useRestoreParticipantVolumes,
  useShortcutActions,
  useVoiceRoomSounds
} from '../../../model/hooks';
import { AndroidCallController } from '../AndroidCallController/AndroidCallController';
import { InvisibleNoticeController } from '../InvisibleNoticeController/InvisibleNoticeController';
import { LocalSpeakingController } from '../LocalSpeakingController/LocalSpeakingController';
import { MicStateController } from '../MicStateController/MicStateController';
import { RoomEasterEggsController } from '../RoomEasterEggsController/RoomEasterEggsController';
import { RoomRealtimeSubscribe } from '../RoomRealtimeSubscribe/RoomRealtimeSubscribe';
import { RoomTrayController } from '../RoomTrayController/RoomTrayController';

export const RoomControllers = ({ roomName }: RoomControllersProps) => {
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
      <RoomTrayController roomName={roomName} />
      <AndroidCallController roomName={roomName} />
      <LocalSpeakingController />
      <MicStateController />
      <RoomEasterEggsController />
      <InvisibleNoticeController />
    </>
  );
};
