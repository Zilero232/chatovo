import { clsx } from 'clsx';
import { useId } from 'react';

import { toGradientStops } from '@/shared/lib';

import type { VoiceLevelRingProps } from './VoiceLevelRing.types';

import s from './VoiceLevelRing.module.scss';

const RING_RADII = [40, 46] as const;

const DEFAULT_COLORS = ['var(--brand-mint)'] as const;

export const VoiceLevelRing = ({ speaking, colors, className }: VoiceLevelRingProps) => {
  const gradientId = useId();

  const stops = toGradientStops(colors ?? DEFAULT_COLORS);

  return (
    <svg
      aria-hidden
      className={clsx(s.root, className)}
      data-speaking={speaking}
      fill='none'
      focusable='false'
      viewBox='0 0 100 100'
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs>
        <linearGradient id={gradientId} x1='0' x2='1' y1='0' y2='1'>
          {stops.map(({ color, offset }) => (
            <stop key={offset} offset={offset} stopColor={color} />
          ))}
        </linearGradient>
      </defs>

      {RING_RADII.map((radius, index) => (
        <circle
          key={radius}
          className={index === 0 ? s.inner : s.outer}
          cx='50'
          cy='50'
          r={radius}
          stroke={`url(#${gradientId})`}
        />
      ))}
    </svg>
  );
};
