import type { ButtonProps } from '@chatovo/ui-kit';
import type { ReactNode } from 'react';

import type { AppSidebarVariant } from '../../AppSidebar.types';

export type SidebarItemProps = Omit<ButtonProps, 'children' | 'size' | 'variant'> & {
  badge?: ReactNode;
  icon: ReactNode;
  label: string;
  title: string;
  variant: AppSidebarVariant;
};
