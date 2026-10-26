import { useTranslations } from 'use-intl';

import type { MusicTrackPlayback } from '../../types';

import { useRoomMusicContext } from '../../contexts';

export const useMusicStage = ({ music, track }: MusicTrackPlayback) => {
  const t = useTranslations('room.music');

  const { setStageSlot } = useRoomMusicContext();

  const service = t(`sources.${track.source}`);
  const addedBy = t('nowPlaying.addedBy', { name: track.addedBy.name });

  return {
    artist: track.artist,
    origin: `${service} · ${addedBy}`,
    isPlaying: music.playback?.status === 'playing',
    setSlot: setStageSlot
  };
};
