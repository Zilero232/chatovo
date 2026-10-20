import type { SVGProps } from 'react';

import { useId } from 'react';

type LogoMarkProps = Omit<SVGProps<SVGSVGElement>, 'height' | 'width'> & {
  size?: number;
  simplified?: boolean;
  withPlaque?: boolean;
};

const DETAIL = 'var(--brand-violet)';

export const LogoMark = ({
  size = 24,
  simplified = false,
  withPlaque = false,
  ...props
}: LogoMarkProps) => {
  const id = useId();
  const plaqueId = `${id}-plaque`;
  const body = withPlaque ? '#ffffff' : 'currentColor';
  const detail = withPlaque ? '#6a4dff' : DETAIL;

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
              <stop offset='0' stopColor='#7b5cff' />
              <stop offset='0.5' stopColor='#6a4dff' />
              <stop offset='1' stopColor='#5a3df0' />
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

        <path d='M27 37 Q26 24 34 28 Q39 31 40 39 Z' fill={detail} opacity={0.85} />
        <path d='M73 37 Q74 24 66 28 Q61 31 60 39 Z' fill={detail} opacity={0.85} />

        {simplified ? (
          <>
            <circle cx='40' cy='54' fill={detail} r='7' />
            <circle cx='60' cy='54' fill={detail} r='7' />
            <path d='M50 61 L45 67 H55 Z' fill={detail} />
          </>
        ) : (
          <>
            <circle cx='40' cy='54' fill={detail} r='6.6' />
            <circle cx='42.3' cy='51.4' fill={body} r='2.2' />
            <path
              d='M54 54 Q60 49 66 54'
              fill='none'
              stroke={detail}
              strokeLinecap='round'
              strokeWidth={4}
            />
            <path d='M50 61 L45.5 67 H54.5 Z' fill={detail} />
            <path
              d='M42 70 Q50 78 58 70'
              fill='none'
              stroke={detail}
              strokeLinecap='round'
              strokeWidth={4}
            />
          </>
        )}
      </g>
    </svg>
  );
};
