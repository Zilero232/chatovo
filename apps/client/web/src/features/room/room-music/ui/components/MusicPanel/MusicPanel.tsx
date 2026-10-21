import { ScrollArea } from '@chatovo/ui-kit';

import type { MusicPanelProps } from './MusicPanel.types';

import { useMusicSearch } from '../../../model/hooks';
import { MusicOutputSettings } from '../MusicOutputSettings/MusicOutputSettings';
import { MusicQueue } from '../MusicQueue/MusicQueue';
import { MusicSearchField } from '../MusicSearchField/MusicSearchField';
import { MusicSearchResults } from '../MusicSearchResults/MusicSearchResults';
import { MyMusicCard } from '../MyMusicCard/MyMusicCard';

import s from './MusicPanel.module.scss';

export const MusicPanel = ({ children }: MusicPanelProps) => {
  const search = useMusicSearch();

  return (
    <div className={s.root}>
      <MusicSearchField search={search} />

      <ScrollArea className={s.scroll} data-music-viewport='scroll'>
        <div className={s.sections}>
          {children}
          <MusicSearchResults search={search} />
          <MusicQueue />
          <MyMusicCard />
        </div>
      </ScrollArea>

      <footer className={s.footer}>
        <MusicOutputSettings />
      </footer>
    </div>
  );
};
