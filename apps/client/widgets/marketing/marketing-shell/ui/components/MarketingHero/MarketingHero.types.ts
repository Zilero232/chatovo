import type { ReactNode } from 'react';

import type { ChatoPose } from '@/ui-kit';

export type MarketingHeroProps = {
  title: string;
  description: string;
  eyebrow?: string;
  chato?: ChatoPose;
  children?: ReactNode;
};
