import { DisconnectReason } from 'livekit-client';
import { useRef } from 'react';

import { getPublishDefaults, useAppSettings } from '@/entities/app/settings';
import { isTokenMicLocked, useIsInvisible, useRecentRooms } from '@/entities/room/room';

import type { UseRoomConnectionInput } from './use-room-connection.types';

import { FAILURE_REASONS } from '../../../config';

export const useRoomConnection = ({
  roomId,
  token,
  onConnectFailure,
  onLeave
}: UseRoomConnectionInput) => {
  const { settings } = useAppSettings();
  const isInvisible = useIsInvisible();
  const { push: pushRecent } = useRecentRooms();

  const isJoiningMuted = isInvisible || isTokenMicLocked(token);

  const hasConnectedRef = useRef(false);

  const audioCaptureRef = useRef(settings.audio);
  const publishDefaultsRef = useRef(
    getPublishDefaults(settings.video.cameraQuality, settings.video.screenQuality)
  );

  const handleConnected = () => {
    hasConnectedRef.current = true;
    pushRecent(roomId);
  };

  const handleDisconnected = (reason?: DisconnectReason) => {
    const hasConnected = hasConnectedRef.current;

    hasConnectedRef.current = false;

    if (hasConnected) {
      onLeave({ isReplaced: reason === DisconnectReason.DUPLICATE_IDENTITY });

      return;
    }

    if (reason !== undefined && FAILURE_REASONS.has(reason)) {
      onConnectFailure(reason);
    }
  };

  return {
    isInvisible,
    audioCapture: isJoiningMuted ? false : audioCaptureRef.current,
    publishDefaults: publishDefaultsRef.current,
    handleConnected,
    handleDisconnected
  };
};
