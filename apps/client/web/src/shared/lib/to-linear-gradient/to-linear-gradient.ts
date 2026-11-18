import type { ToLinearGradientInput } from './to-linear-gradient.types';

/** A CSS `linear-gradient(...)` through the colours; a single colour still yields a valid gradient. */
export const toLinearGradient = ({
  colors,
  angle = 135,
  repeat = false
}: ToLinearGradientInput) => {
  const stops = repeat ? [...colors, colors[0]] : [...colors];
  const padded = stops.length === 1 ? [stops[0], stops[0]] : stops;

  return `linear-gradient(${angle}deg, ${padded.join(', ')})`;
};
