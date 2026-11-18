import { useAppSettings } from '@/entities/app/settings';
import { appEvents } from '@/shared/lib';

import { useRunningGame } from './use-running-game';

export const useGameActivityCard = () => {
  const { settings, setGroup } = useAppSettings();

  const game = useRunningGame();

  const isSharing = settings.system.shareActivity;

  const toggleSharing = () => {
    setGroup('system', { shareActivity: !isSharing });
  };

  const openSettings = () => {
    appEvents.emit.settingsOpen({ tab: 'system' });
  };

  return { game, isSharing, toggleSharing, openSettings };
};
