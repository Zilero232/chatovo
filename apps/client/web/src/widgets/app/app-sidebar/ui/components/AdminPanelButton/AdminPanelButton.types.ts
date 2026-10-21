import type { AppSidebarVariant } from '../../AppSidebar.types';

export type AdminPanelButtonProps = {
  variant: AppSidebarVariant;
  onNavigate?: () => void;
};
