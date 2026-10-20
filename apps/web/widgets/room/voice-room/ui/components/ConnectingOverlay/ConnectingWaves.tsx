import type { CSSProperties } from 'react';

import { clsx } from 'clsx';
import { useId } from 'react';

import type { ConnectingWavesProps } from './ConnectingOverlay.types';

import s from './ConnectingWaves.module.scss';

const RING_RADII = [18, 30, 42];

export const ConnectingWaves = ({ className, ...props }: ConnectingWavesProps) => {
  const gradientId = useId();

  return (
    <svg
      aria-hidden
      className={clsx(s.root, className)}
      fill='none'
      focusable='false'
      viewBox='0 0 120 120'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <defs>
        <linearGradient id={gradientId} x1='0' x2='1' y1='0' y2='1'>
          <stop offset='0%' stopColor='var(--brand-coral)' />
          <stop offset='100%' stopColor='var(--brand-sun)' />
        </linearGradient>
      </defs>

      <g stroke={`url(#${gradientId})`} strokeWidth='2'>
        {RING_RADII.map((radius, index) => (
          <circle
            key={radius}
            className={s.ring}
            cx='60'
            cy='60'
            r={radius}
            style={{ '--ring-delay': `${index * 0.55}s` } as CSSProperties}
          />
        ))}
      </g>

      <circle className={s.core} cx='60' cy='60' fill={`url(#${gradientId})`} r='9' />
    </svg>
  );
};
