import type { ReactNode } from 'react';

export type RevealOnScrollProps = {
  as?: 'article' | 'div' | 'li' | 'section';
  children: ReactNode;
  className?: string;
  delay?: number;
};
