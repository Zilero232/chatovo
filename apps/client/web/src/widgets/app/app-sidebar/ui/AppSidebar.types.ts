export type AppSidebarVariant = 'menu' | 'rail';

export type AppSidebarProps = {
  channelsOpened?: boolean;
  variant?: AppSidebarVariant;
  onNavigate?: () => void;
  onToggleChannels?: () => void;
};
