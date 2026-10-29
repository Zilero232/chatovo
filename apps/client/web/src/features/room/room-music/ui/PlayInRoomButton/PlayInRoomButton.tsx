import { Spinner } from '@chatovo/ui-kit';
import { Check, Play } from 'lucide-react';
import { match } from 'ts-pattern';
import { useTranslations } from 'use-intl';

import type { PlayInRoomButtonProps } from './PlayInRoomButton.types';

import { usePlayInRoom } from '../../model/hooks';

import s from './PlayInRoomButton.module.scss';

export const PlayInRoomButton = ({ url }: PlayInRoomButtonProps) => {
  const t = useTranslations('room.music');

  const { source, canPlay, isPending, isAdded, play } = usePlayInRoom(url);

  if (!canPlay || source === null) {
    return null;
  }

  const state = match({ isPending, isAdded })
    .with({ isPending: true }, () => 'pending' as const)
    .with({ isAdded: true }, () => 'added' as const)
    .otherwise(() => 'idle' as const);

  return (
    <button
      aria-busy={isPending}
      aria-disabled={state !== 'idle'}
      className={s.root}
      data-state={state}
      type='button'
      onClick={play}
    >
      <span aria-hidden className={s.badge}>
        {match(state)
          .with('pending', () => <Spinner decorative />)
          .with('added', () => <Check />)
          .with('idle', () => <Play />)
          .exhaustive()}
      </span>

      <span className={s.label}>{isAdded ? t('add.added') : t('playInRoom')}</span>

      <span className={s.source}>{t(`sources.${source}`)}</span>
    </button>
  );
};
