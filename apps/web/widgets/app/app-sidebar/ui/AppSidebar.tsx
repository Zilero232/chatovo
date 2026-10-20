'use client';

import { isTauri } from '@tauri-apps/api/core';
import { clsx } from 'clsx';

import { useIsTauriDesktop } from '@/shared/hooks';

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
  channelsOpened,
  orientation = 'vertical',
  showToggleChannels = true,
  onNavigate,
  onToggleChannels
}: AppSidebarProps) => {
  const isDesktop = useIsTauriDesktop();
  const isVertical = orientation === 'vertical';

  return (
    <div
      className={clsx(s.root, {
        [s.vertical]: isVertical,
        [s.horizontal]: !isVertical
      })}
    >
      {showToggleChannels && (
        <ToggleChannelsButton opened={channelsOpened} onToggle={onToggleChannels} />
      )}
      <LobbyButton side={isVertical ? 'right' : 'top'} onNavigate={onNavigate} />
      {!isTauri() && <DownloadAppButton />}
      <div className={s.spacer} />
      {isDesktop && <CheckUpdateButton />}
      <AdminMenuButton side={isVertical ? 'right' : 'top'} onNavigate={onNavigate} />
      <GnomeVpnButton />
    </div>
  );
};
