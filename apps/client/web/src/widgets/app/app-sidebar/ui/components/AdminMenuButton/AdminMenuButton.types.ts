import type { AppSidebarVariant } from '../../AppSidebar.types';

export type AdminMenuButtonProps = {
  variant: AppSidebarVariant;
  onNavigate?: () => void;
};
