'use client';

import { getHours, minutesToMilliseconds } from 'date-fns';
import { useEffect, useRef } from 'react';

import {
  MUTE_MASTER_TOGGLES,
  NIGHT_OWL_FROM_HOUR,
  NIGHT_OWL_TO_HOUR,
  QUIET_ONE_MINUTES,
  SOLO_CONCERT_MINUTES
} from '../../config';
import { useAchievements } from './use-achievements';

type TrackerArgs = {
  isInRoom: boolean;
  isMicEnabled: boolean;
  participantCount: number;
};

export const useAchievementTracker = ({
  isInRoom,
  isMicEnabled,
  participantCount
}: TrackerArgs) => {
  const { unlock } = useAchievements();

  const muteCountRef = useRef(0);
  const hasSeenMicStateRef = useRef(false);

  useEffect(() => {
    const hour = getHours(new Date());

    if (hour >= NIGHT_OWL_FROM_HOUR && hour < NIGHT_OWL_TO_HOUR) {
      unlock('nightOwl');
    }
    // eslint-disable-next-line react/exhaustive-deps -- run once on mount; `unlock` is recreated every render
  }, []);

  useEffect(() => {
    if (!hasSeenMicStateRef.current) {
      hasSeenMicStateRef.current = true;

      return;
    }

    muteCountRef.current += 1;

    if (muteCountRef.current > MUTE_MASTER_TOGGLES) {
      unlock('muteMaster');
    }
    // eslint-disable-next-line react/exhaustive-deps -- counts every mic state flip, whatever triggered it
  }, [isMicEnabled]);

  useEffect(() => {
    if (!isInRoom || isMicEnabled) {
      return;
    }

    const quietTimer = window.setTimeout(
      unlock,
      minutesToMilliseconds(QUIET_ONE_MINUTES),
      'quietOne'
    );

    return () => window.clearTimeout(quietTimer);
    // eslint-disable-next-line react/exhaustive-deps -- unmuting restarts the streak; `unlock` is recreated every render
  }, [isInRoom, isMicEnabled]);

  useEffect(() => {
    if (!isInRoom || participantCount !== 1) {
      return;
    }

    const soloTimer = window.setTimeout(
      unlock,
      minutesToMilliseconds(SOLO_CONCERT_MINUTES),
      'soloConcert'
    );

    return () => window.clearTimeout(soloTimer);
    // eslint-disable-next-line react/exhaustive-deps -- see above
  }, [isInRoom, participantCount]);
};
