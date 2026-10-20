import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type StatCardTone = 'brand' | 'danger' | 'default' | 'success';

export type StatCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  hint?: ReactNode;
  tone?: StatCardTone;
};
