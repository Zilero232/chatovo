import type { ReactNode } from 'react';

import type { ChatoPose } from '../Chato';

export type ChatoSceneProps = {
  children?: ReactNode;
  pose?: ChatoPose;
  size?: 'lg' | 'md' | 'sm';
  className?: string;
};
