import type { SVGProps } from 'react';

// Flag of Russia — three equal horizontal bands: white, blue, red.
export const FlagRuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg aria-hidden='true' viewBox='0 0 4 3' {...props}>
    <rect fill='#fff' height='3' width='4' />
    <rect fill='#0039a6' height='2' width='4' y='1' />
    <rect fill='#d52b1e' height='1' width='4' y='2' />
  </svg>
);
