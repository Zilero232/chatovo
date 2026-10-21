import type { AppSidebarVariant } from '../../AppSidebar.types';

export type LobbyButtonProps = {
  variant: AppSidebarVariant;
  onNavigate?: () => void;
};
