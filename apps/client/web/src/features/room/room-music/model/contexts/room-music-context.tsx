import { createContextHook } from '@siberiacancode/reactuse';
import { useState } from 'react';

import { useAppSettings } from '@/entities/app/settings';
import { useCurrentUser } from '@/entities/auth/user';
import { useRoomMusic } from '@/entities/room/music';

import type { PlayerReport, TrackDuration } from '../types';
import type { RoomMusicProviderProps, RoomMusicStateInput } from './room-music-context.types';

import { useHasRemoteMusic, useMusicShare, useVolumeRamp } from '../hooks';

const useRoomMusicState = ({ roomId, isDeafened }: RoomMusicStateInput) => {
  const { settings } = useAppSettings();
  const { isAdmin } = useCurrentUser();
  const { volume } = settings.music;

  const music = useRoomMusic(roomId);
  const hasRemoteMusic = useHasRemoteMusic();
  const share = useMusicShare();

  const [isExpanded, setIsExpanded] = useState(false);
  const [barSlot, setBarSlot] = useState<HTMLElement | null>(null);
  const [stageSlot, setStageSlot] = useState<HTMLElement | null>(null);
  const [trackDuration, setTrackDuration] = useState<TrackDuration | null>(null);
  const [playerReport, setPlayerReport] = useState<PlayerReport | null>(null);
  const [playerAttempt, setPlayerAttempt] = useState(0);

  const canControl = !(isAdmin && settings.system.invisibleMode);
  const isMusicActive = Boolean(music?.current) || hasRemoteMusic || share.state.mode !== 'idle';

  const outputVolume = isDeafened ? 0 : volume;

  useVolumeRamp({
    target: outputVolume,
    resetKey: share.state.mode,
    apply: share.setMonitorVolume
  });

  const retryPlayer = () => {
    setPlayerReport(null);
    setPlayerAttempt((attempt) => attempt + 1);
  };

  return {
    roomId,
    music,
    share,
    outputVolume,
    canControl,
    isMusicActive,
    isExpanded,
    setIsExpanded,
    barSlot,
    setBarSlot,
    stageSlot,
    setStageSlot,
    trackDuration,
    setTrackDuration,
    playerReport,
    setPlayerReport,
    playerAttempt,
    retryPlayer
  };
};

const { Provider, use } = createContextHook(useRoomMusicState);

export const RoomMusicProvider = ({ roomId, isDeafened, children }: RoomMusicProviderProps) => (
  <Provider params={[{ roomId, isDeafened }]}>{children}</Provider>
);

export const useMaybeRoomMusicContext = use;

export const useRoomMusicContext = () => {
  const value = use();

  if (!value) {
    throw new Error('useRoomMusicContext must be used within RoomMusicProvider');
  }

  return value;
};
