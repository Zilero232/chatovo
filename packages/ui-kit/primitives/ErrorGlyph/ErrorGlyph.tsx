import { clsx } from 'clsx';
import { useId } from 'react';
import { match } from 'ts-pattern';

import type { ErrorGlyphProps } from './ErrorGlyph.types';

import { BrokenWaveGlyph, LostSignalGlyph, SeveredRingGlyph } from './components';

import s from './ErrorGlyph.module.scss';

export const ErrorGlyph = ({ variant = 'broken-wave', className, ...props }: ErrorGlyphProps) => {
  const gradientId = useId();

  return (
    <svg
      aria-hidden
      className={clsx(s.root, className)}
      fill='none'
      focusable='false'
      viewBox='0 0 148 148'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <defs>
        <linearGradient id={gradientId} x1='0' x2='1' y1='0' y2='1'>
          <stop offset='0%' stopColor='var(--brand-coral)' />
          <stop offset='100%' stopColor='var(--brand-sun)' />
        </linearGradient>
      </defs>

      <g stroke={`url(#${gradientId})`} strokeLinecap='round'>
        {match(variant)
          .with('broken-wave', () => <BrokenWaveGlyph />)
          .with('lost-signal', () => <LostSignalGlyph gradientId={gradientId} />)
          .with('severed-ring', () => <SeveredRingGlyph gradientId={gradientId} />)
          .exhaustive()}
      </g>
    </svg>
  );
};
