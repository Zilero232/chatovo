import { isTauri } from '@tauri-apps/api/core';
import { clsx } from 'clsx';

import { useCurrentUser } from '@/entities/auth/user';
import { isTauriDesktop } from '@/shared/lib';

import type { AppSidebarProps } from './AppSidebar.types';

import {
  AdminPanelButton,
  CheckUpdateButton,
  DownloadAppButton,
  GnomeVpnButton,
  InvisibleModeButton,
  LobbyButton,
  ToggleChannelsButton
} from './components';

import s from './AppSidebar.module.scss';

export const AppSidebar = ({
  channelsOpened = false,
  variant = 'rail',
  onNavigate,
  onToggleChannels
}: AppSidebarProps) => {
  const { isAdmin } = useCurrentUser();

  const isDesktop = isTauriDesktop();
  const isRail = variant === 'rail';

  return (
    <div className={clsx(s.root, isRail ? s.rail : s.menu)}>
      {isRail && onToggleChannels && (
        <ToggleChannelsButton opened={channelsOpened} onToggle={onToggleChannels} />
      )}
      <LobbyButton variant={variant} onNavigate={onNavigate} />
      {!isTauri() && <DownloadAppButton variant={variant} />}
      <div className={s.spacer} />
      {isDesktop && <CheckUpdateButton variant={variant} />}
      {isAdmin && (
        <>
          <AdminPanelButton variant={variant} onNavigate={onNavigate} />
          <InvisibleModeButton variant={variant} />
        </>
      )}
      <GnomeVpnButton variant={variant} />
    </div>
  );
};
