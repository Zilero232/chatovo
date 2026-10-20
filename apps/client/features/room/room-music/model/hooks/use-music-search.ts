'use client';

import type { MusicEnqueueItem, RadioStation } from '@chatovo/schemas';
import type { FormEvent } from 'react';

import { useDebounceValue } from '@siberiacancode/reactuse';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { useToastError } from '@/entities/app/locale';
import { useRadioStations } from '@/entities/room/music';

import { RADIO_SEARCH_DEBOUNCE_MS } from '../../config/music';
import { classifyMusicQuery } from '../../lib';
import { useCurrentRoomMusic } from './use-current-room-music';

export const useMusicSearch = () => {
  const t = useTranslations('room.music.add');
  const toastError = useToastError();

  const { actions } = useCurrentRoomMusic();

  const [value, setValue] = useState('');

  const query = classifyMusicQuery(value);
  const searchQuery = query.kind === 'search' ? query.query : '';

  const debouncedQuery = useDebounceValue(searchQuery, RADIO_SEARCH_DEBOUNCE_MS);
  const { stations, isFetching, isError } = useRadioStations(debouncedQuery);

  const enqueue = (item: MusicEnqueueItem) => {
    actions.enqueue.mutate(item, {
      onSuccess: () => {
        toast.success(t('added'), { id: 'music-enqueue' });
        setValue('');
      },
      onError: toastError('music-enqueue')
    });
  };

  const addLink = () => {
    if (query.kind === 'link' && !actions.enqueue.isPending) {
      enqueue({ kind: 'link', url: query.link.url });
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addLink();
  };

  return {
    value,
    query,
    stations,
    isSearching: isFetching || debouncedQuery !== searchQuery,
    isError,
    isAdding: actions.enqueue.isPending,
    setValue,
    clear: () => setValue(''),
    addLink,
    onSubmit,
    playStation: (station: RadioStation) => enqueue({ kind: 'radio', stationId: station.id })
  };
};
