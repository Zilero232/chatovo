import { ScrollArea, Tabs, TabsContent, TabsList, TabsTrigger } from '@chatovo/ui-kit';
import { useTranslations } from 'use-intl';

import type { MusicLibraryTab } from '../../../model/types';

import { useMusicLibrary } from '../../../model/hooks';
import { MyMusicCard } from '../MyMusicCard/MyMusicCard';
import { QueueTab } from '../QueueTab/QueueTab';
import { RadioTab } from '../RadioTab/RadioTab';

import s from './MusicLibrary.module.scss';

export const MusicLibrary = () => {
  const t = useTranslations('room.music');

  const { tab, link, radio, stations, queueCount, setTab, searchRadio, openRadio, openMine } =
    useMusicLibrary();

  return (
    <Tabs className={s.root} value={tab} onValueChange={(next) => setTab(next as MusicLibraryTab)}>
      <TabsList className={s.tabs}>
        <TabsTrigger className={s.tab} value='queue'>
          <span className={s.tabLabel}>{t('tabs.queue')}</span>
          {queueCount > 0 && <span className={s.count}>{queueCount}</span>}
        </TabsTrigger>
        <TabsTrigger className={s.tab} value='radio'>
          <span className={s.tabLabel}>{t('tabs.radio')}</span>
        </TabsTrigger>
        <TabsTrigger className={s.tab} value='mine'>
          <span className={s.tabLabel}>{t('share.title')}</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent className={s.panel} value='queue'>
        <QueueTab
          field={link}
          onOpenMine={openMine}
          onOpenRadio={openRadio}
          onSearchRadio={searchRadio}
        />
      </TabsContent>

      <TabsContent className={s.panel} value='radio'>
        <RadioTab field={radio} stations={stations} onOpenMine={openMine} />
      </TabsContent>

      <TabsContent className={s.panel} value='mine'>
        <ScrollArea className={s.scroll}>
          <div className={s.sections}>
            <MyMusicCard />
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};
