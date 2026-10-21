import type { ReactNode } from 'react';

export type ShareOptionProps = {
  description: string;
  icon: ReactNode;
  isDisabled?: boolean;
  title: string;
  onSelect: () => void;
};
