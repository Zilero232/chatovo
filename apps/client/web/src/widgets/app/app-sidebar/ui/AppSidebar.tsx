import { isTauri } from '@tauri-apps/api/core';
import { clsx } from 'clsx';

import { isTauriDesktop } from '@/shared/lib';

import type { AppSidebarProps } from './AppSidebar.types';

import {
  AdminMenuButton,
  CheckUpdateButton,
  DownloadAppButton,
  GnomeVpnButton,
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
      <AdminMenuButton variant={variant} onNavigate={onNavigate} />
      <GnomeVpnButton variant={variant} />
    </div>
  );
};
