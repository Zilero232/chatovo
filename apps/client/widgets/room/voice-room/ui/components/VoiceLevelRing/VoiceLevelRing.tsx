'use client';

import { clsx } from 'clsx';
import { useId } from 'react';

import type { VoiceLevelRingProps } from './VoiceLevelRing.types';

import s from './VoiceLevelRing.module.scss';

const RING_RADII = [40, 46] as const;

export const VoiceLevelRing = ({ speaking, className }: VoiceLevelRingProps) => {
  const gradientId = useId();

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
          <stop offset='0%' stopColor='var(--brand-mint)' />
          <stop offset='100%' stopColor='var(--brand-mint)' />
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
