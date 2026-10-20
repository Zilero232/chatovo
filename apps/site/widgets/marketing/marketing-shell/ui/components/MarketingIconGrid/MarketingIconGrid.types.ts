import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type MarketingIconGridItem = {
  description: string;
  Icon: LucideIcon;
  key: string;
  title: string;
};

export type MarketingIconGridProps = {
  items: readonly MarketingIconGridItem[];
  children?: ReactNode;
  columns?: 2 | 3 | 4;
  delayStep?: number;
  description?: string;
  heading?: string;
  id?: string;
  className?: string;
};
