import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsContent,
  Tooltip,
  TooltipContent
} from '@chatovo/ui-kit';
import { useBoolean } from '@siberiacancode/reactuse';
import { clsx } from 'clsx';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'use-intl';

import { useCurrentUser } from '@/entities/auth/user';
import { isTauriDesktop } from '@/shared/lib';

import type { SettingsTabId } from '../config';

import { SETTINGS_TABS } from '../config';
import { SettingsSidebar } from './components/SettingsSidebar/SettingsSidebar';

import s from './AppSettingsButton.module.scss';

export const AppSettingsButton = () => {
  const t = useTranslations('settings');

  const { emailVerified, user } = useCurrentUser();

  const [isOpen, toggleOpen] = useBoolean(false);
  const [activeTab, setActiveTab] = useState<SettingsTabId>('profile');
  const isDesktop = isTauriDesktop();

  const needsEmailVerification = Boolean(user && !emailVerified);
  const tabs = SETTINGS_TABS.filter((tab) => !tab.tauriDesktopOnly || isDesktop);

  return (
    <>
      <Tooltip>
        <Button
          aria-label={t('open')}
          className={clsx({ [s.settingsButtonAlert]: needsEmailVerification })}
          size='icon'
          type='button'
          variant='ghost'
          onClick={() => toggleOpen(true)}
        >
          <Settings />
          {needsEmailVerification && <span aria-hidden className={s.settingsAlertDot} />}
        </Button>
        <TooltipContent>{t('title')}</TooltipContent>
      </Tooltip>

      <Dialog open={isOpen} onOpenChange={toggleOpen}>
        <DialogContent className={s.content} popupClassName={s.popup}>
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </DialogHeader>

          <Tabs
            className={s.tabs}
            orientation='vertical'
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as SettingsTabId)}
          >
            <SettingsSidebar needsEmailVerification={needsEmailVerification} tabs={tabs} />

            {tabs.map((tab) => (
              <TabsContent key={tab.id} className={s.tabsContent} value={tab.id}>
                {tab.render({ jumpTo: setActiveTab })}
              </TabsContent>
            ))}
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};
