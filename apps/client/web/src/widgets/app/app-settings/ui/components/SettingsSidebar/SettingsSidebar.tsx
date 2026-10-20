import { TabsList, TabsTrigger } from '@chatovo/ui-kit';
import { useTranslations } from 'use-intl';

import type { SettingsSidebarProps } from './SettingsSidebar.types';

import { LogoutButton } from '../LogoutButton/LogoutButton';

import s from '../../AppSettingsButton.module.scss';

export const SettingsSidebar = ({ needsEmailVerification, tabs }: SettingsSidebarProps) => {
  const t = useTranslations('settings');

  return (
    <div className={s.sidebar}>
      <TabsList className={s.tabsList}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} className={s.tabsTrigger} value={tab.id}>
            {tab.icon}
            {t(`tabs.${tab.id}`)}
            {tab.id === 'security' && needsEmailVerification && (
              <span aria-hidden className={s.tabAlertDot} />
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      <LogoutButton />
    </div>
  );
};
