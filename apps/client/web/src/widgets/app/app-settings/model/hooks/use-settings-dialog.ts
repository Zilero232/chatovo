import { useState } from 'react';

import { useCurrentUser } from '@/entities/auth/user';
import { appEvents, isTauriDesktop } from '@/shared/lib';

import type { SettingsSectionId, SettingsTabId } from '../../config';
import type { SettingsView } from '../types';

import { SETTINGS_GROUPS } from '../../config';
import { scrollToSettingsSection } from '../../lib/scroll-to-settings-section';

export const useSettingsDialog = () => {
  const { emailVerified, user } = useCurrentUser();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTabId>('profile');
  const [view, setView] = useState<SettingsView>('list');

  appEvents.on.settingsOpen(({ tab }) => {
    const target = SETTINGS_GROUPS.flatMap((group) => group.tabs).find(
      ({ id, tauriDesktopOnly }) => id === tab && (!tauriDesktopOnly || isTauriDesktop())
    );

    if (target) {
      setActiveTab(target.id);
    }

    setView(target ? 'detail' : 'list');
    setIsOpen(true);
  });

  const isDesktop = isTauriDesktop();
  const needsEmailVerification = Boolean(user && !emailVerified);

  const groups = SETTINGS_GROUPS.map((group) => ({
    ...group,
    tabs: group.tabs.filter((tab) => !tab.tauriDesktopOnly || isDesktop)
  })).filter((group) => group.tabs.length > 0);

  const tabs = groups.flatMap((group) => group.tabs);

  const setOpen = (open: boolean) => {
    setIsOpen(open);

    if (open) {
      setView('list');
    }
  };

  const selectTab = (id: SettingsTabId) => {
    setActiveTab(id);
    setView('detail');
  };

  const openSection = (section: SettingsSectionId) => {
    scrollToSettingsSection(section);
  };

  return {
    isOpen,
    activeTab,
    view,
    groups,
    tabs,
    needsEmailVerification,
    setOpen,
    selectTab,
    backToList: () => setView('list'),
    openSection
  };
};
