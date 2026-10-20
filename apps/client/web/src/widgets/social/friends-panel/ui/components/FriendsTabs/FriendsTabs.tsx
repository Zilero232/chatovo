import { SearchField, Tabs, TabsContent } from '@chatovo/ui-kit';
import { useTranslations } from 'use-intl';

import type { FriendsTabValue } from '@/features/social/friend-chat';

import { useFriendsTabs } from '../../../model/hooks';
import { AddFriendTab } from '../AddFriendTab/AddFriendTab';
import { DevelopersTab } from '../DevelopersTab/DevelopersTab';
import { FriendsTab } from '../FriendsTab/FriendsTab';
import { FriendsTabsBar } from '../FriendsTabsBar/FriendsTabsBar';
import { RequestsTab } from '../RequestsTab/RequestsTab';

import s from '../../FriendsPanel.module.scss';

export const FriendsTabs = () => {
  const t = useTranslations('friends');

  const { friendsTab, query, friendsCount, incomingCount, onlineCount, setFriendsTab, setQuery } =
    useFriendsTabs();

  return (
    <Tabs
      className={s.tabs}
      value={friendsTab}
      onValueChange={(next) => setFriendsTab(next as FriendsTabValue)}
    >
      <FriendsTabsBar
        friendsCount={friendsCount}
        incomingCount={incomingCount}
        isAddActive={friendsTab === 'add'}
        onAddFriend={() => setFriendsTab('add')}
      />

      <div className={s.body}>
        <TabsContent className={s.tabContent} value='online'>
          <SearchField
            className={s.search}
            placeholder={t('searchPlaceholder')}
            value={query}
            onValueChange={setQuery}
          />
          <FriendsTab
            onlyOnline
            countLabel={t('onlineCount', { count: onlineCount })}
            query={query}
          />
        </TabsContent>

        <TabsContent className={s.tabContent} value='all'>
          <SearchField
            className={s.search}
            placeholder={t('searchPlaceholder')}
            value={query}
            onValueChange={setQuery}
          />
          <FriendsTab countLabel={t('allCount', { count: friendsCount })} query={query} />
        </TabsContent>

        <TabsContent className={s.tabContent} value='pending'>
          <RequestsTab />
        </TabsContent>

        <TabsContent className={s.tabContent} value='developers'>
          <DevelopersTab />
        </TabsContent>

        <TabsContent className={s.tabContent} value='add'>
          <AddFriendTab />
        </TabsContent>
      </div>
    </Tabs>
  );
};
