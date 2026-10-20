'use client';

import { useQuery } from '@tanstack/react-query';

import { useAppSettings } from '@/entities/app/settings';
import { QUERY_KEYS } from '@/shared/constants';
import { isTauriDesktop } from '@/shared/lib';

import { detectRunningGame } from '../../api';
import { GAME_ACTIVITY_POLL_INTERVAL_MS } from '../../config';

export const useGameActivity = (): string | null => {
  const { settings } = useAppSettings();

  const isEnabled = settings.system.shareActivity && isTauriDesktop();

  const { data } = useQuery({
    queryKey: QUERY_KEYS.runningGame(),
    queryFn: detectRunningGame,
    enabled: isEnabled,
    refetchInterval: GAME_ACTIVITY_POLL_INTERVAL_MS,
    refetchOnWindowFocus: false,
    staleTime: GAME_ACTIVITY_POLL_INTERVAL_MS,
    gcTime: 0
  });

  if (!isEnabled) {
    return null;
  }

  return data ?? null;
};
