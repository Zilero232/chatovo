import type { PlayerFailure, PlayerStatus } from '../../types';

import { useRoomMusicContext } from '../../contexts';

export const usePlayerStatus = (trackId: string) => {
  const { playerReport, playerAttempt, retryPlayer } = useRoomMusicContext();

  const report = playerReport?.trackId === trackId ? playerReport : null;
  const status: PlayerStatus = report?.status ?? 'loading';
  const failure: PlayerFailure | null = report?.status === 'unavailable' ? report.failure : null;

  return { status, failure, attempt: playerAttempt, retry: retryPlayer };
};
