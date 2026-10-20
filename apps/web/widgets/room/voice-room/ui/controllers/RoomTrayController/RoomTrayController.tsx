'use client';

import { useConnectionState, useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { ConnectionState } from 'livekit-client';
import { useTranslations } from 'next-intl';
import { isNullish } from 'remeda';
import { match } from 'ts-pattern';

import type { TrayAction } from '@/features/app/system-tray';

import { useAppSettings } from '@/entities/app/settings';
import { useTrayBridge } from '@/features/app/system-tray';
import { useDeafen } from '@/features/room/room-control';
import { isTauriDesktop } from '@/shared/lib';

import { toggleMicrophone } from '../../../lib';

export const RoomTrayController = () => {
  const t = useTranslations('tray');

  const room = useRoomContext();
  const connectionState = useConnectionState();
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();
  const { isDeafened, toggle: toggleDeafen } = useDeafen();
  const { settings } = useAppSettings();

  const isPtt = settings.audio.activationMode === 'pushToTalk';
  const isInRoom = isTauriDesktop() && !isNullish(localParticipant);
  const isMuted = isPtt ? false : !isMicrophoneEnabled;

  const status = match({ connectionState, isInRoom, isMuted })
    .with({ connectionState: ConnectionState.Connecting }, () => t('status.connecting'))
    .with({ connectionState: ConnectionState.Reconnecting }, () => t('status.reconnecting'))
    .with({ connectionState: ConnectionState.SignalReconnecting }, () => t('status.reconnecting'))
    .with({ isInRoom: false }, () => t('status.online'))
    .with({ isMuted: true }, () => t('status.muted'))
    .otherwise(() => t('status.inRoom', { room: room.name }));

  const handleAction = (action: TrayAction) => {
    void match(action)
      .with('toggleMute', async () => {
        if (isInRoom) {
          await toggleMicrophone({ localParticipant, isPtt, source: 'tray' });
        }
      })
      .with('toggleDeafen', async () => {
        toggleDeafen();
      })
      .with('leaveRoom', async () => {
        if (isInRoom) {
          await room.disconnect();
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
