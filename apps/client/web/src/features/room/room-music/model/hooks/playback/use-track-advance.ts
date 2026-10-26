import { useRef } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import type { PlayerFailure } from '../../types';

import { useRoomMusicContext } from '../../contexts';
import { useCurrentRoomMusic } from '../use-current-room-music';

export const useTrackAdvance = (trackId: string) => {
  const t = useTranslations('room.music.player');

  const { actions } = useCurrentRoomMusic();
  const { setPlayerReport } = useRoomMusicContext();

  const hasAdvancedRef = useRef(false);

  const advance = () => {
    if (hasAdvancedRef.current) {
      return;
    }

    hasAdvancedRef.current = true;
    actions.control.mutate(
      { action: 'next', trackId },
      {
        onError: () => {
          hasAdvancedRef.current = false;
        }
      }
    );
  };

  const skipRemovedTrack = () => {
    toast.error(t('removed'), { id: `music-removed-${trackId}` });
    advance();
  };

  const reportUnavailable = (failure: PlayerFailure) => {
    setPlayerReport({ trackId, status: 'unavailable', failure });
  };

  return { advance, skipRemovedTrack, reportUnavailable };
};
