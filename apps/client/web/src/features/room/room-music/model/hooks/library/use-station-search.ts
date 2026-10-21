import type { RadioStation } from '@chatovo/schemas';

import { useDebounceValue } from '@siberiacancode/reactuse';

import { useRadioStations } from '@/entities/room/music';

import type { MusicQuery } from '../../../lib/index';

import { RADIO_SEARCH_DEBOUNCE_MS } from '../../../config/music';
import { useMusicEnqueue } from './use-music-enqueue';

export const useStationSearch = (query: MusicQuery) => {
  const { enqueue } = useMusicEnqueue();

  const searchQuery = query.kind === 'search' ? query.query : '';

  const debouncedQuery = useDebounceValue(searchQuery, RADIO_SEARCH_DEBOUNCE_MS);
  const { stations, isFetching, isError } = useRadioStations(debouncedQuery);

  return {
    stations,
    isSearching: isFetching || debouncedQuery !== searchQuery,
    isError,
    playStation: (station: RadioStation) =>
      enqueue({ item: { kind: 'radio', stationId: station.id } })
  };
};
