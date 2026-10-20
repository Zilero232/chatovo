import type { SVGProps } from 'react';

export type ChatoPose = 'listen' | 'peek' | 'sleep' | 'wave' | 'wink';

export type ChatoEyes = 'closed' | 'happy' | 'open' | 'wink';

export type ChatoProps = Omit<SVGProps<SVGSVGElement>, 'children'> & {
  pose?: ChatoPose;
  title?: string;
};
