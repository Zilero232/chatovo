import { ScrollArea, Tabs, TabsContent, TabsList, TabsTrigger } from '@chatovo/ui-kit';
import { clsx } from 'clsx';
import { useState } from 'react';
import { useTranslations } from 'use-intl';

import type { AdminTab } from './AdminPage.types';

import {
  AdminGuard,
  AdminHeader,
  AdminOverview,
  AdminReports,
  AdminRooms,
  AdminUsers
} from './components';

import s from './AdminPage.module.scss';

const TABS: AdminTab[] = ['overview', 'reports', 'users', 'rooms'];

export const AdminPage = () => {
  const t = useTranslations('admin');

  const [tab, setTab] = useState<AdminTab>('overview');

  return (
    <AdminGuard>
      <ScrollArea className={s.root}>
        <div className={clsx(s.container, 'pb-page')}>
          <AdminHeader />

          <Tabs value={tab} onValueChange={(value) => setTab(value as AdminTab)}>
            <div className={s.tabsScroller}>
              <TabsList className={s.tabs}>
                {TABS.map((value) => (
                  <TabsTrigger key={value} value={value}>
                    {t(`tabs.${value}`)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value='overview'>
              <AdminOverview enabled={tab === 'overview'} />
            </TabsContent>

            <TabsContent value='reports'>
              <AdminReports enabled={tab === 'reports'} />
            </TabsContent>

            <TabsContent value='users'>
              <AdminUsers enabled={tab === 'users'} />
            </TabsContent>

            <TabsContent value='rooms'>
              <AdminRooms enabled={tab === 'rooms'} />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </AdminGuard>
  );
};
