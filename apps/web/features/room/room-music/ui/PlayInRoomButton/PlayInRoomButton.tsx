'use client';

import { Button } from '@chatovo/ui-kit';
import { ListPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { PlayInRoomButtonProps } from './PlayInRoomButton.types';

import { usePlayInRoom } from '../../model/hooks';

export const PlayInRoomButton = ({ url }: PlayInRoomButtonProps) => {
  const t = useTranslations('room.music');

  const { canPlay, isPending, play } = usePlayInRoom(url);

  if (!canPlay) {
    return null;
  }

  return (
    <Button disabled={isPending} size='xs' variant='secondary' onClick={play}>
      <ListPlus aria-hidden />
      {t('playInRoom')}
    </Button>
  );
};
