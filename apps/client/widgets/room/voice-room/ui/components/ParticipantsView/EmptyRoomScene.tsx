import { clsx } from 'clsx';
import { useId } from 'react';

import type { EmptyRoomSceneProps } from './ParticipantsView.types';

import s from './EmptyRoomScene.module.scss';

const SEAT_POSITIONS = [40, 100, 160];

export const EmptyRoomScene = ({ className, ...props }: EmptyRoomSceneProps) => {
  const gradientId = useId();
  const fadeId = useId();

  return (
    <svg
      aria-hidden
      className={clsx(s.root, className)}
      fill='none'
      focusable='false'
      preserveAspectRatio='xMidYMid meet'
      viewBox='0 0 200 120'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <defs>
        <linearGradient id={gradientId} x1='0' x2='1' y1='0' y2='0'>
          <stop offset='0%' stopColor='var(--brand-coral)' />
          <stop offset='100%' stopColor='var(--brand-sun)' />
        </linearGradient>
        <linearGradient id={fadeId} x1='0' x2='1' y1='0' y2='0'>
          <stop offset='0%' stopColor='white' stopOpacity='0' />
          <stop offset='50%' stopColor='white' stopOpacity='1' />
          <stop offset='100%' stopColor='white' stopOpacity='0' />
        </linearGradient>
        <mask id={`${fadeId}-mask`}>
          <rect fill={`url(#${fadeId})`} height='120' width='200' />
        </mask>
      </defs>

      <g mask={`url(#${fadeId}-mask)`} stroke={`url(#${gradientId})`}>
        <path
          d='M40 60 Q70 34 100 60 T160 60'
          opacity='0.5'
          strokeDasharray='4 6'
          strokeLinecap='round'
          strokeWidth='1.5'
        />

        {SEAT_POSITIONS.map((cx, index) => (
          <circle
            key={cx}
            cx={cx}
            cy='60'
            opacity={index === 1 ? 0.9 : 0.45}
            r={index === 1 ? 16 : 12}
            strokeDasharray={index === 1 ? undefined : '3 5'}
            strokeWidth='1.5'
          />
        ))}

        <circle cx='100' cy='60' fill={`url(#${gradientId})`} opacity='0.35' r='5' stroke='none' />
      </g>
    </svg>
  );
};
