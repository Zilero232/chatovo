import type { MusicTrack } from '@chatovo/schemas';

import { useTranslations } from 'use-intl';

import { useRoomMusicContext } from '../../contexts';
import { usePlaybackControls } from '../playback/use-playback-controls';
import { usePlayerStatus } from '../players/use-player-status';

export const useMusicMiniBar = (track: MusicTrack) => {
  const t = useTranslations('room.music');

  const { canControl, setBarSlot, setIsExpanded } = useRoomMusicContext();
  const { isPlaying, isPending, togglePlay, previous, next, stop } = usePlaybackControls();
  const { status, attempt } = usePlayerStatus(track.id);

  const isUnavailable = status === 'unavailable';

  return {
    subtitle: isUnavailable
      ? t('player.notPlayingHere')
      : (track.artist ?? t('nowPlaying.addedBy', { name: track.addedBy.name })),
    isUnavailable,
    playerKey: `${track.id}:${attempt}`,
    isRadio: track.source === 'radio',
    canControl,
    isPlaying,
    isPending,
    setSlot: setBarSlot,
    togglePlay,
    previous,
    next,
    stop,
    expand: () => setIsExpanded(true)
  };
};
