import {
  Button,
  Dialog,
  DialogContent,
  Tabs,
  TabsContent,
  Tooltip,
  TooltipContent
} from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { Settings } from 'lucide-react';
import { useTranslations } from 'use-intl';

import type { SettingsTabId } from '../config';

import { useSettingsDialog } from '../model/hooks';
import { SettingsDetailHeader } from './components/SettingsDetailHeader/SettingsDetailHeader';
import { SettingsSidebar } from './components/SettingsSidebar/SettingsSidebar';

import s from './AppSettingsButton.module.scss';

export const AppSettingsButton = () => {
  const t = useTranslations('settings');

  const {
    isOpen,
    activeTab,
    view,
    groups,
    tabs,
    needsEmailVerification,
    setOpen,
    selectTab,
    backToList,
    openSection
  } = useSettingsDialog();

  return (
    <>
      <Tooltip>
        <Button
          aria-label={t('open')}
          className={clsx({ [s.settingsButtonAlert]: needsEmailVerification })}
          size='icon'
          type='button'
          variant='ghost'
          onClick={() => setOpen(true)}
        >
          <Settings />
          {needsEmailVerification && <span aria-hidden className={s.settingsAlertDot} />}
        </Button>
        <TooltipContent>{t('title')}</TooltipContent>
      </Tooltip>

      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent className={s.content} popupClassName={s.popup}>
          <Tabs
            className={s.tabs}
            data-view={view}
            orientation='vertical'
            value={activeTab}
            onValueChange={(value) => selectTab(value as SettingsTabId)}
          >
            <SettingsSidebar
              activeTab={activeTab}
              groups={groups}
              needsEmailVerification={needsEmailVerification}
              onOpenSection={openSection}
              onSelectTab={selectTab}
            />

            <div className={s.main}>
              <SettingsDetailHeader activeTab={activeTab} onBack={backToList} />

              {tabs.map((tab) => (
                <TabsContent key={tab.id} className={s.tabsContent} value={tab.id}>
                  {tab.render({ jumpTo: selectTab })}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};
