import { clamp } from 'remeda';

export const formatPercent = (ratio: number): string =>
  `${Math.round(clamp(ratio, { min: 0, max: 1 }) * 100)}%`;
