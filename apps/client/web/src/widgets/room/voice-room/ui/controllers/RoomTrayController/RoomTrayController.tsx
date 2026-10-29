import { useConnectionState, useLocalParticipant } from '@livekit/components-react';
import { ConnectionState } from 'livekit-client';
import { isNullish } from 'remeda';
import { toast } from 'sonner';
import { match } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import type { TrayAction } from '@/features/app/system-tray';

import { useAppSettings } from '@/entities/app/settings';
import { useInvisibleGuard } from '@/entities/room/room';
import { useTrayBridge } from '@/features/app/system-tray';
import { useDeafen, useLeaveRoom } from '@/features/room/room-control';
import { isTauriDesktop } from '@/shared/lib';

import type { RoomTrayControllerProps } from './RoomTrayController.types';

import { toggleMicrophone } from '../../../lib';

export const RoomTrayController = ({ roomName }: RoomTrayControllerProps) => {
  const t = useTranslations('tray');
  const tControls = useTranslations('room.controls');

  const connectionState = useConnectionState();
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();
  const { isDeafened, toggle: toggleDeafen } = useDeafen();
  const leave = useLeaveRoom();
  const { settings } = useAppSettings();
  const { blockIfInvisible } = useInvisibleGuard();

  const isPtt = settings.audio.activationMode === 'pushToTalk';
  const isInRoom = isTauriDesktop() && !isNullish(localParticipant);
  const isMuted = isPtt ? false : !isMicrophoneEnabled;

  const status = match({ connectionState, isInRoom, isMuted })
    .with({ connectionState: ConnectionState.Connecting }, () => t('status.connecting'))
    .with({ connectionState: ConnectionState.Reconnecting }, () => t('status.reconnecting'))
    .with({ connectionState: ConnectionState.SignalReconnecting }, () => t('status.reconnecting'))
    .with({ isInRoom: false }, () => t('status.online'))
    .with({ isMuted: true }, () => t('status.muted'))
    .otherwise(() => t('status.inRoom', { room: roomName }));

  const handleAction = (action: TrayAction) => {
    void match(action)
      .with('toggleMute', async () => {
        if (isInRoom && !blockIfInvisible()) {
          await toggleMicrophone({
            localParticipant,
            isPtt,
            source: 'tray',
            onLocked: () => toast.info(tControls('mutedByOwner'), { id: 'mic-muted-by-owner' })
          });
        }
      })
      .with('toggleDeafen', async () => {
        toggleDeafen();
      })
      .with('leaveRoom', async () => {
        if (isInRoom) {
          leave();
        }
      })
      .otherwise(async () => {});
  };

  useTrayBridge({
    state: { status, isInRoom, isMuted, isDeafened },
    onAction: handleAction
  });

  return null;
};
