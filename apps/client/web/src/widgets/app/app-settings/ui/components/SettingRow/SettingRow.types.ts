import type { ReactNode } from 'react';

export type SettingRowProps = {
  control: ReactNode;
  hint?: string;
  label: string;
  stacked?: boolean;
};
