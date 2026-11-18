import { useAppSettings } from '@/entities/app/settings';

import { useRunningGame } from './use-running-game';

export const useGameActivity = (): string | null => {
  const { settings } = useAppSettings();

  const game = useRunningGame();

  return settings.system.shareActivity ? game : null;
};
