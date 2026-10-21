import type { FormEvent } from 'react';

import { useState } from 'react';

import { classifyMusicQuery } from '../../../lib/index';
import { useMusicEnqueue } from './use-music-enqueue';

export const useMusicQueryField = () => {
  const { enqueue, isAdding } = useMusicEnqueue();

  const [value, setValue] = useState('');

  const query = classifyMusicQuery(value);

  const addLink = () => {
    if (query.kind === 'link' && !isAdding) {
      enqueue({ item: { kind: 'link', url: query.link.url }, onAdded: () => setValue('') });
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addLink();
  };

  return {
    value,
    query,
    isAdding,
    setValue,
    clear: () => setValue(''),
    addLink,
    onSubmit
  };
};
