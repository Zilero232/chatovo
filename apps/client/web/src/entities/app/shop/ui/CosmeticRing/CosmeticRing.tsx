import { clsx } from 'clsx';
import { useId } from 'react';

import { toGradientStops } from '@/shared/lib';

import type { CosmeticRingProps } from './CosmeticRing.types';

import s from './CosmeticRing.module.scss';

export const CosmeticRing = ({ item, className }: CosmeticRingProps) => {
  const gradientId = useId();

  const { colors, animated } = item;
  const stops = toGradientStops(colors);

  return (
    <svg
      aria-hidden
      className={clsx(s.root, { [s.animated]: animated }, className)}
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

      <circle className={s.glow} cx='50' cy='50' r='46' stroke={`url(#${gradientId})`} />
      <circle className={s.ring} cx='50' cy='50' r='46' stroke={`url(#${gradientId})`} />
    </svg>
  );
};
