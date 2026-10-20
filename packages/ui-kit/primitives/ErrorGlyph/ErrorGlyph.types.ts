import type { ComponentProps } from 'react';

export type ErrorGlyphVariant = 'broken-wave' | 'lost-signal' | 'severed-ring';

export type ErrorGlyphProps = {
  variant?: ErrorGlyphVariant;
} & ComponentProps<'svg'>;
