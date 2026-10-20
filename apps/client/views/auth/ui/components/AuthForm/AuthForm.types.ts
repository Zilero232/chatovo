import type { AuthMode } from '../../../model/types';

export type AuthFormProps = {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
};
