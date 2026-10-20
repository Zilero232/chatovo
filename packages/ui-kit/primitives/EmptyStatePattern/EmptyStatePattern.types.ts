import type { ComponentProps } from 'react';

export type EmptyStatePatternVariant = 'dots' | 'waveform' | 'waves';

export type EmptyStatePatternProps = {
  variant?: EmptyStatePatternVariant;
} & ComponentProps<'svg'>;
