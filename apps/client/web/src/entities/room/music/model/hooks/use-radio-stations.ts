import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { searchRadioStations } from '@/shared/api';
import { QUERY_KEYS } from '@/shared/constants';

import { RADIO_STATIONS_STALE_MS } from '../../config/music';

export const useRadioStations = (query: string) => {
  const { data, isFetching, isError } = useQuery({
    queryKey: QUERY_KEYS.radioStations(query),
    queryFn: () => searchRadioStations(query),
    staleTime: RADIO_STATIONS_STALE_MS,
    placeholderData: keepPreviousData,
    enabled: query !== ''
  });

  return { stations: data?.stations ?? [], isFetching, isError };
};
