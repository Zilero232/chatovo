import type { GradientStop } from './to-gradient-stops.types';

/** Spreads the colours evenly from 0% to 100% as SVG `<stop>` data; one colour sits at 0%. */
export const toGradientStops = (colors: readonly string[]): GradientStop[] => {
  const lastIndex = Math.max(colors.length - 1, 1);

  return colors.map((color, index) => ({ color, offset: `${(index / lastIndex) * 100}%` }));
};
