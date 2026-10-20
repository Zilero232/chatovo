import { clsx } from 'clsx';
import { useId } from 'react';
import { match } from 'ts-pattern';

import type { EmptyStatePatternProps } from './EmptyStatePattern.types';

import s from './EmptyStatePattern.module.scss';

const WAVE_RADII = [26, 42, 58, 74, 90];

const WAVEFORM_BARS = [12, 26, 44, 22, 58, 36, 70, 40, 54, 24, 38, 18, 30, 14];

export const EmptyStatePattern = ({
  variant = 'waves',
  className,
  ...props
}: EmptyStatePatternProps) => {
  const gradientId = useId();
  const fadeId = useId();

  return (
    <svg
      aria-hidden
      className={clsx(s.root, className)}
      fill='none'
      focusable='false'
      viewBox='0 0 200 200'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <defs>
        <linearGradient id={gradientId} x1='0' x2='1' y1='0' y2='1'>
          <stop offset='0%' stopColor='var(--brand-coral)' />
          <stop offset='100%' stopColor='var(--brand-sun)' />
        </linearGradient>
        <radialGradient id={fadeId}>
          <stop offset='40%' stopColor='white' stopOpacity='1' />
          <stop offset='100%' stopColor='white' stopOpacity='0' />
        </radialGradient>
        <mask id={`${fadeId}-mask`}>
          <rect fill={`url(#${fadeId})`} height='200' width='200' />
        </mask>
      </defs>

      <g mask={`url(#${fadeId}-mask)`}>
        {match(variant)
          .with('waves', () => (
            <g stroke={`url(#${gradientId})`} strokeWidth='1.25'>
              {WAVE_RADII.map((radius, index) => (
                <circle
                  key={radius}
                  cx='100'
                  cy='100'
                  opacity={0.55 - index * 0.09}
                  r={radius}
                  strokeDasharray={index % 2 === 0 ? undefined : '3 7'}
                />
              ))}
              <circle cx='100' cy='100' fill={`url(#${gradientId})`} opacity='0.5' r='5' />
            </g>
          ))
          .with('dots', () => (
            <g fill={`url(#${gradientId})`} opacity='0.45'>
              {Array.from({ length: 9 }, (_, row) =>
                Array.from({ length: 9 }, (_, column) => (
                  <circle
                    key={`${row}-${column}`}
                    cx={20 + column * 20}
                    cy={20 + row * 20}
                    r={1.6}
                  />
                ))
              )}
            </g>
          ))
          .with('waveform', () => (
            <g stroke={`url(#${gradientId})`} strokeLinecap='round' strokeWidth='4'>
              {WAVEFORM_BARS.map((height, index) => {
                const x = 20 + index * 12;

                return (
                  <line
                    key={x}
                    opacity={0.25 + (height / 70) * 0.45}
                    x1={x}
                    x2={x}
                    y1={100 - height / 2}
                    y2={100 + height / 2}
                  />
                );
              })}
            </g>
          ))
          .exhaustive()}
      </g>
    </svg>
  );
};
