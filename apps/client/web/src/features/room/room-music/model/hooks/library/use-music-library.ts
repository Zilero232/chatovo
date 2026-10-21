import { useState } from 'react';

import type { MusicLibraryTab } from '../../types';

import { useCurrentRoomMusic } from '../use-current-room-music';
import { useMusicQueryField } from './use-music-query-field';
import { useStationSearch } from './use-station-search';

export const useMusicLibrary = () => {
  const { music } = useCurrentRoomMusic();

  const [tab, setTab] = useState<MusicLibraryTab>('queue');

  const link = useMusicQueryField();
  const radio = useMusicQueryField();
  const stations = useStationSearch(radio.query);

  const searchRadio = (query: string) => {
    radio.setValue(query);
    link.clear();
    setTab('radio');
  };

  const openRadio = () => {
    setTab('radio');
  };

  const openMine = () => {
    setTab('mine');
  };

  return {
    tab,
    link,
    radio,
    stations,
    queueCount: music?.queue.length ?? 0,
    setTab,
    searchRadio,
    openRadio,
    openMine
  };
};
