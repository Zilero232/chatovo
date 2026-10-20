import type { ChatoPose } from '@chatovo/ui-kit';
import type { ReactNode } from 'react';

export type MarketingSceneProps = {
  children?: ReactNode;
  pose?: ChatoPose;
  size?: 'lg' | 'md';
  className?: string;
};
