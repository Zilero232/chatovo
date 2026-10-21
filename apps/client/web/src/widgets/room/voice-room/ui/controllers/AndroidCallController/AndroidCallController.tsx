import { useConnectionState } from '@livekit/components-react';
import { ConnectionState } from 'livekit-client';
import { useEffect } from 'react';
import { useTranslations } from 'use-intl';

import { isTauriMobile } from '@/shared/lib';

import type { AndroidCallControllerProps } from './AndroidCallController.types';

import { postCallServiceMessage } from '../../../lib';

const LIVE_STATES = new Set<ConnectionState>([
  ConnectionState.Connected,
  ConnectionState.Reconnecting,
  ConnectionState.SignalReconnecting
]);

export const AndroidCallController = ({ roomName }: AndroidCallControllerProps) => {
  const t = useTranslations('room.callService');
  const connectionState = useConnectionState();

  const isLive = LIVE_STATES.has(connectionState) && isTauriMobile();
  const text = t('text');
  const channel = t('channel');

  useEffect(() => {
    if (!isLive) {
      return;
    }

    postCallServiceMessage({ type: 'start', title: roomName, text, channel });
  }, [isLive, roomName, text, channel]);

  useEffect(() => {
    if (!isLive) {
      return;
    }

    return () => postCallServiceMessage({ type: 'stop' });
  }, [isLive]);

  return null;
};
