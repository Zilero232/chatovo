'use client';

import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { toast } from 'sonner';

import { useCurrentRoomMusic } from './use-current-room-music';

export const useTrackAdvance = (trackId: string) => {
  const t = useTranslations('room.music.player');

  const { actions } = useCurrentRoomMusic();

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

  const skipUnplayable = () => {
    toast.error(t('unplayable'), { id: `music-unplayable-${trackId}` });
    advance();
  };

  const reportUnavailable = () => {
    toast.error(t('unavailable'), { id: `music-unavailable-${trackId}` });
  };

  return { advance, skipUnplayable, reportUnavailable };
};
