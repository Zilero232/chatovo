import { Tabs, TabsContent, TabsList, TabsTrigger } from '@chatovo/ui-kit';
import { AudioLines, Users } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'use-intl';

import { ChannelsPanel } from '@/widgets/room/channels-panel';
import { FriendsPanel } from '@/widgets/social/friends-panel';

import type { LobbySection } from './LobbySections.types';

import s from './LobbySections.module.scss';

export const LobbySections = () => {
  const t = useTranslations('lobby.sections');

  const [section, setSection] = useState<LobbySection>('rooms');

  return (
    <Tabs
      className={s.root}
      value={section}
      onValueChange={(value) => setSection(value as LobbySection)}
    >
      <TabsList className={s.list}>
        <TabsTrigger className={s.trigger} value='rooms'>
          <AudioLines aria-hidden />
          {t('rooms')}
        </TabsTrigger>
        <TabsTrigger className={s.trigger} value='friends'>
          <Users aria-hidden />
          {t('friends')}
        </TabsTrigger>
      </TabsList>

      <TabsContent className={s.panel} value='rooms'>
        <ChannelsPanel variant='drawer' />
      </TabsContent>

      <TabsContent className={s.panel} value='friends'>
        <FriendsPanel />
      </TabsContent>
    </Tabs>
  );
};
