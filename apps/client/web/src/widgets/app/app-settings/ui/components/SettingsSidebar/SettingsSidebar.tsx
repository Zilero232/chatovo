import { TabsList, TabsTrigger } from '@chatovo/ui-kit';
import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import { useTranslations } from 'use-intl';

import type { SettingsSidebarProps } from './SettingsSidebar.types';

import { LogoutButton } from '../LogoutButton/LogoutButton';
import { SettingsProfileCard } from '../SettingsProfileCard/SettingsProfileCard';

import s from '../../AppSettingsButton.module.scss';

export const SettingsSidebar = ({
  groups,
  activeTab,
  needsEmailVerification,
  onSelectTab,
  onOpenSection
}: SettingsSidebarProps) => {
  const t = useTranslations('settings');

  return (
    <div className={s.sidebar}>
      <h2 className={s.sidebarTitle}>{t('title')}</h2>

      <SettingsProfileCard onEdit={() => onSelectTab('profile')} />

      <TabsList className={s.tabsList}>
        {groups.map((group) => (
          <Fragment key={group.id}>
            <span className={s.groupLabel}>{t(`groups.${group.id}`)}</span>

            {group.tabs.map((tab) => (
              <Fragment key={tab.id}>
                <TabsTrigger
                  className={s.tabsTrigger}
                  value={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                >
                  {tab.icon}
                  {t(`tabs.${tab.id}`)}
                  {tab.id === 'security' && needsEmailVerification && (
                    <span aria-hidden className={s.tabAlertDot} />
                  )}
                  <ChevronRight aria-hidden className={s.triggerChevron} />
                </TabsTrigger>

                {tab.id === activeTab && tab.sections && (
                  <span className={s.subItems}>
                    {tab.sections.map((section) => (
                      <button
                        key={section}
                        className={s.subItem}
                        type='button'
                        onClick={() => onOpenSection(section)}
                      >
                        {t(`sections.${section}`)}
                      </button>
                    ))}
                  </span>
                )}
              </Fragment>
            ))}
          </Fragment>
        ))}
      </TabsList>

      <LogoutButton />
    </div>
  );
};
