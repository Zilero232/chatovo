import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';
import { isTauriDesktop } from '@/shared/lib';

import { detectRunningGame } from '../../api';
import { GAME_ACTIVITY_POLL_INTERVAL_MS } from '../../config';

export const useRunningGame = (): string | null => {
  const isDesktop = isTauriDesktop();

  const { data } = useQuery({
    queryKey: QUERY_KEYS.runningGame(),
    queryFn: detectRunningGame,
    enabled: isDesktop,
    refetchInterval: GAME_ACTIVITY_POLL_INTERVAL_MS,
    refetchOnWindowFocus: false,
    staleTime: GAME_ACTIVITY_POLL_INTERVAL_MS,
    gcTime: 0
  });

  return isDesktop ? (data ?? null) : null;
};
