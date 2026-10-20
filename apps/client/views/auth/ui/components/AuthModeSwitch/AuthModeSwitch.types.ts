import type { AuthMode } from '../../../model/types';

export type AuthModeSwitchProps = {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
};
