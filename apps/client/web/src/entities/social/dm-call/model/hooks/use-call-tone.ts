import { useAppSettings } from '@/entities/app/settings';

import type { CallToneKind } from '../../config';

import { playCallTone } from '../../lib';

export const useCallTone = () => {
  const { settings } = useAppSettings();

  const { enabled, volume } = settings.sounds;

  return (kind: CallToneKind) => {
    if (enabled.call) {
      playCallTone({ kind, volume });
    }
  };
};
