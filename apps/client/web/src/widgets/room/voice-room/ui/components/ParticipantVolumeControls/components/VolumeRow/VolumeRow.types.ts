import type { ReactNode } from 'react';

export type VolumeRowProps = {
  icon: ReactNode;
  isMuted?: boolean;
  label: string;
  muteLabel?: string;
  sliderLabel: string;
  volume: number;
  onToggleMute?: () => void;
  onVolumeChange: (next: number) => void;
};
