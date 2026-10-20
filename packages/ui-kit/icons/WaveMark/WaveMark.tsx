import type { SVGProps } from 'react';

import { clsx } from 'clsx';

import s from './WaveMark.module.scss';

type WaveMarkProps = Omit<SVGProps<SVGSVGElement>, 'height' | 'width'> & {
  animated?: boolean;
  size?: number;
};

const BARS = [
  { x: 6, height: 12 },
  { x: 15, height: 26 },
  { x: 24, height: 40 },
  { x: 33, height: 26 },
  { x: 42, height: 12 }
];

export const WaveMark = ({ animated = false, size = 48, className, ...props }: WaveMarkProps) => (
  <svg
    aria-hidden
    className={clsx(s.root, className)}
    fill='none'
    focusable='false'
    height={size}
    viewBox='0 0 48 48'
    width={size}
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <g className={clsx(s.bars, { [s.animated]: animated })}>
      {BARS.map(({ x, height }, index) => (
        <line
          key={x}
          className={s[`bar${index}`]}
          x1={x}
          x2={x}
          y1={24 - height / 2}
          y2={24 + height / 2}
        />
      ))}
    </g>
  </svg>
);
