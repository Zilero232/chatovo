import type { MicActivationMode } from '@/entities/app/settings';

export type MicActivationSectionProps = {
  activationMode: MicActivationMode;
  pttBindingMissing: boolean;
  onActivationModeChange: (value: MicActivationMode) => void;
  onJumpToShortcuts: () => void;
};
