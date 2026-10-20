export type AppSidebarOrientation = 'horizontal' | 'vertical';

export type AppSidebarProps = {
  channelsOpened: boolean;
  orientation?: AppSidebarOrientation;
  showToggleChannels?: boolean;
  onNavigate?: () => void;
  onToggleChannels: () => void;
};
