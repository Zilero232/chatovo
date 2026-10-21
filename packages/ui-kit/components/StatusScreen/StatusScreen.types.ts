import type { ReactNode } from 'react';

export type StatusScreenProps = {
  illustration: ReactNode;
  /** A short code above the title, such as `404`. */
  code?: string;
  title: string;
  description: string;
  actions: ReactNode;
  className?: string;
};
