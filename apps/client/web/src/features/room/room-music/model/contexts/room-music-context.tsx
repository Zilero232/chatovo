import { createContextHook } from '@siberiacancode/reactuse';
import { useState } from 'react';

import { useAppSettings } from '@/entities/app/settings';
import { useCurrentUser } from '@/entities/auth/user';
import { useRoomMusic } from '@/entities/room/music';

import type { TrackDuration } from '../types';
import type { RoomMusicProviderProps, RoomMusicStateInput } from './room-music-context.types';

import { DUCKING } from '../../config/music';
import { useHasRemoteMusic } from '../hooks/use-has-remote-music';
import { useMusicShare } from '../hooks/use-music-share';
import { useSpeechDucking } from '../hooks/use-speech-ducking';
import { useVolumeRamp } from '../hooks/use-volume-ramp';

const useRoomMusicState = ({ roomId, isDeafened }: RoomMusicStateInput) => {
  const { settings } = useAppSettings();
  const { isAdmin } = useCurrentUser();
  const { volume, ducking } = settings.music;

  const music = useRoomMusic(roomId);
  const hasRemoteMusic = useHasRemoteMusic();
  const share = useMusicShare();

  const [isExpanded, setIsExpanded] = useState(false);
  const [barSlot, setBarSlot] = useState<HTMLElement | null>(null);
  const [stageSlot, setStageSlot] = useState<HTMLElement | null>(null);
  const [trackDuration, setTrackDuration] = useState<TrackDuration | null>(null);

  const canControl = !(isAdmin && settings.system.invisibleMode);
  const isMusicActive = Boolean(music?.current) || hasRemoteMusic || share.state.mode !== 'idle';

  const isDucked = useSpeechDucking(ducking && isMusicActive && !isDeafened);

  const outputVolume = isDeafened ? 0 : volume * (isDucked ? DUCKING.level : 1);

  useVolumeRamp({
    target: outputVolume,
    resetKey: share.state.mode,
    apply: share.setMonitorVolume
  });

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
    setTrackDuration
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
