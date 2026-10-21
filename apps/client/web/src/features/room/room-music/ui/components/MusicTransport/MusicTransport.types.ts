import type { IconButtonWithTooltipProps } from '@chatovo/ui-kit';

export type MusicTransportProps = {
  isPlaying: boolean;
  isPending: boolean;
  size: 'compact' | 'regular';
  tooltipSide?: IconButtonWithTooltipProps['tooltipSide'];
  className?: string;
  onPrevious: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
};
