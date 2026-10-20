import { clsx } from 'clsx';
import { useId } from 'react';

import type { BannerPatternProps } from './BannerPattern.types';

import s from './BannerPattern.module.scss';

const ARC_RADII = [22, 40, 58, 76, 94, 112];

export const BannerPattern = ({ className, ...props }: BannerPatternProps) => {
  const id = useId();
  const fadeId = `${id}-fade`;
  const maskId = `${id}-mask`;
  const dotsId = `${id}-dots`;

  return (
    <svg
      aria-hidden
      className={clsx(s.root, className)}
      fill='none'
      focusable='false'
      preserveAspectRatio='xMinYMid slice'
      viewBox='0 0 320 80'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <defs>
        <linearGradient id={fadeId} x1='0' x2='1' y1='0' y2='0'>
          <stop offset='0%' stopColor='white' stopOpacity='1' />
          <stop offset='55%' stopColor='white' stopOpacity='0.55' />
          <stop offset='100%' stopColor='white' stopOpacity='0' />
        </linearGradient>

        <mask id={maskId}>
          <rect fill={`url(#${fadeId})`} height='80' width='320' />
        </mask>

        <pattern height='14' id={dotsId} patternUnits='userSpaceOnUse' width='14'>
          <circle cx='1.6' cy='1.6' fill='white' r='1.1' />
        </pattern>
      </defs>

      <g mask={`url(#${maskId})`}>
        <rect className={s.dots} fill={`url(#${dotsId})`} height='80' width='320' />

        <g className={s.arcs} fill='none' strokeLinecap='round'>
          {ARC_RADII.map((radius) => (
            <circle key={radius} cx='24' cy='80' r={radius} />
          ))}
        </g>
      </g>
    </svg>
  );
};
