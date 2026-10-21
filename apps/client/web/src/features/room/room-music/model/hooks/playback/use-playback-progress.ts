import { useDebounceCallback, useInterval } from '@siberiacancode/reactuse';
import { useState } from 'react';
import { clamp } from 'remeda';

import { useToastError } from '@/entities/app/locale';
import { getExpectedPositionMs } from '@/entities/room/music';

import type { MusicTrackPlayback, SeekInput } from '../../types';

import { PLAYBACK_PROGRESS } from '../../../config/music';
import { useRoomMusicContext } from '../../contexts';
import { useCurrentRoomMusic } from '../use-current-room-music';

export const usePlaybackProgress = ({ music, track }: MusicTrackPlayback) => {
  const toastError = useToastError();

  const { trackDuration } = useRoomMusicContext();
  const { actions } = useCurrentRoomMusic();

  const [now, setNow] = useState(() => Date.now());
  const [draftMs, setDraftMs] = useState<number | null>(null);

  useInterval(() => setNow(Date.now()), PLAYBACK_PROGRESS.tickMs);

  const isLive = track.source === 'radio';
  const durationMs = trackDuration?.trackId === track.id ? trackDuration.durationMs : null;
  const expectedMs = getExpectedPositionMs({ music, now });
  const positionMs = draftMs ?? clamp(expectedMs, { min: 0, max: durationMs ?? expectedMs });

  const commitSeek = (next: number) => {
    actions.control.mutate(
      { action: 'seek', positionMs: Math.round(next) },
      { onError: toastError('music-seek'), onSettled: () => setDraftMs(null) }
    );
  };

  const commitKeyboardSeek = useDebounceCallback(commitSeek, PLAYBACK_PROGRESS.keyboardCommitMs);

  const seek = ({ positionMs: next, reason }: SeekInput) => {
    setDraftMs(next);

    if (reason === 'keyboard') {
      commitKeyboardSeek(next);
    } else {
      commitSeek(next);
    }
  };

  return {
    isLive,
    positionMs,
    durationMs,
    canSeek: !isLive && durationMs !== null,
    preview: setDraftMs,
    seek
  };
};
