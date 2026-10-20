import type { SVGProps } from 'react';

import { useId } from 'react';

type LogoMarkProps = Omit<SVGProps<SVGSVGElement>, 'height' | 'width'> & {
  size?: number;
  simplified?: boolean;
  withPlaque?: boolean;
};

const PLAQUE = { from: '#ff8f6b', mid: '#ff7a59', to: '#f2643f' } as const;
const PLAQUE_COLORS = { body: '#fff6ea', ear: '#ff9f86', ink: '#2c1a33' } as const;
const BARE_COLORS = {
  body: 'currentColor',
  ear: 'var(--brand-coral)',
  ink: 'var(--background)'
} as const;

export const LogoMark = ({
  size = 24,
  simplified = false,
  withPlaque = false,
  ...props
}: LogoMarkProps) => {
  const id = useId();
  const plaqueId = `${id}-plaque`;
  const { body, ear, ink } = withPlaque ? PLAQUE_COLORS : BARE_COLORS;

  return (
    <svg
      aria-label='Chatovo'
      fill='none'
      height={size}
      role='img'
      viewBox='0 0 100 100'
      width={size}
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      {withPlaque && (
        <>
          <defs>
            <linearGradient id={plaqueId} x1='0' x2='1' y1='0' y2='1'>
              <stop offset='0' stopColor={PLAQUE.from} />
              <stop offset='0.5' stopColor={PLAQUE.mid} />
              <stop offset='1' stopColor={PLAQUE.to} />
            </linearGradient>
          </defs>
          <rect fill={`url(#${plaqueId})`} height='100' rx='22' width='100' />
        </>
      )}

      <g transform={withPlaque ? 'translate(50 50) scale(0.88) translate(-50 -50)' : undefined}>
        <g fill={body}>
          <path d='M21 41 Q18 16 35 23 Q43 27 45 40 Z' />
          <path d='M79 41 Q82 16 65 23 Q57 27 55 40 Z' />
          <path d='M50 30 Q79 30 79 56 Q79 76 64 82 Q57 80 50 82 Q43 80 36 82 Q21 76 21 56 Q21 30 50 30 Z' />
        </g>

        <path d='M27 37 Q26 24 34 28 Q39 31 40 39 Z' fill={ear} />
        <path d='M73 37 Q74 24 66 28 Q61 31 60 39 Z' fill={ear} />

        {simplified ? (
          <>
            <circle cx='40' cy='54' fill={ink} r='7' />
            <circle cx='60' cy='54' fill={ink} r='7' />
            <path d='M50 61 L45 67 H55 Z' fill={ink} />
          </>
        ) : (
          <>
            <circle cx='40' cy='54' fill={ink} r='6.6' />
            <circle cx='42.3' cy='51.4' fill={body} r='2.2' />
            <path
              d='M54 54 Q60 49 66 54'
              fill='none'
              stroke={ink}
              strokeLinecap='round'
              strokeWidth={4}
            />
            <path d='M50 61 L45.5 67 H54.5 Z' fill={ink} />
            <path
              d='M42 70 Q50 78 58 70'
              fill='none'
              stroke={ink}
              strokeLinecap='round'
              strokeWidth={4}
            />
          </>
        )}
      </g>
    </svg>
  );
};
