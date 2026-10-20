import type { ChatoPose } from '@chatovo/ui-kit';
import type { ReactNode } from 'react';

export type MarketingHeroProps = {
  title: string;
  description: string;
  eyebrow?: string;
  chato?: ChatoPose;
  visual?: ReactNode;
  children?: ReactNode;
};
